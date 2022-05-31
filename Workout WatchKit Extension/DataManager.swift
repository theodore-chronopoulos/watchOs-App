
import Foundation
import HealthKit
import FirebaseAuth
import FirebaseDatabase

class DataManager: NSObject, ObservableObject, HKWorkoutSessionDelegate, HKLiveWorkoutBuilderDelegate {
    
    enum WorkoutState {
        case inactive, active, paused
    }
    var ref: DatabaseReference = Database.database().reference();
    var userID = Auth.auth().currentUser?.uid
    
    var heartRate = [Double]()
    var heartTimesArray = [String]()
    var heartCounter = 0
    
    var hrvRate = [Double]()
    var hrvTimesArray = [String]()
    var hrvCounter = 0
    
    
    var oxygen = [Double]()
    var oxygenTimesArray = [String]()
    var oxygenCounter = 0
    
    var healthStore = HKHealthStore()
    var workoutSession: HKWorkoutSession?
    var workoutBuilder: HKLiveWorkoutBuilder?
    
    var activity = HKWorkoutActivityType.walking
    var activityString = ""
    
    @Published var state = WorkoutState.inactive
    @Published var totalDistance = 0.0
    @Published var lastHeartRate = 0.0
    @Published var lastHRV = 0.0
    @Published var lastOxygenSaturation = 0.0
    @Published var measurement_counter: Float = UserDefaults.standard.float(forKey: "measurement_counter")
    
    func start() {
        let sampleTypes: Set<HKSampleType> = [
            .workoutType(),
            .quantityType(forIdentifier: .heartRate)!,
            .quantityType(forIdentifier: .heartRateVariabilitySDNN)!,
            .quantityType(forIdentifier: .restingHeartRate)!,
            .quantityType(forIdentifier: .oxygenSaturation)!,
            .quantityType(forIdentifier: .distanceWalkingRunning)!,
            .quantityType(forIdentifier: .distanceDownhillSnowSports)!,
            .quantityType(forIdentifier: .distanceCycling)!
        ]
        healthStore.requestAuthorization(toShare: sampleTypes, read: sampleTypes) { success, error in
            if success {
                self.beginWorkout()
            }
        }
    }
    
    private func beginWorkout() {
        let config = HKWorkoutConfiguration()
        config.activityType = activity
        config.locationType = .outdoor
        
        do {
            workoutSession = try HKWorkoutSession(healthStore: healthStore, configuration: config)
            workoutBuilder = workoutSession?.associatedWorkoutBuilder()
            workoutBuilder?.dataSource = HKLiveWorkoutDataSource(healthStore: healthStore, workoutConfiguration: config)
            
            workoutSession?.delegate = self
            workoutBuilder?.delegate = self
            
            workoutSession?.startActivity(with: Date())
            workoutBuilder?.beginCollection(withStart: Date()) { success, error in
                guard success else {
                    return
                }
                
                DispatchQueue.main.async {
                    self.state = .active
                }
            }
        } catch {
            print("Could not build workout")
        }
    }
    
    func workoutSession(_ workoutSession: HKWorkoutSession, didChangeTo toState: HKWorkoutSessionState, from fromState: HKWorkoutSessionState, date: Date) {
        DispatchQueue.main.async {
            switch toState {
            case .running:
                self.state = .active
                
            case .paused:
                self.state = .paused
                
            case .ended:
                self.save()
                
            default:
                break
            }
        }
    }
    
    func workoutSession(_ workoutSession: HKWorkoutSession, didFailWithError error: Error) {
        //handle errors
    }
    
    func workoutBuilder(_ workoutBuilder: HKLiveWorkoutBuilder, didCollectDataOf collectedTypes: Set<HKSampleType>) {
        
        getOxygenLevel { x,_ in
            self.lastOxygenSaturation = x ?? self.lastOxygenSaturation
            print(x ?? "0")
        }
        
        for type in collectedTypes {
            guard let quantityType = type as? HKQuantityType else { continue }
            guard let statistics = workoutBuilder.statistics(for: quantityType) else { continue }
            
            DispatchQueue.main.async {
                switch statistics.quantityType {
                case HKQuantityType.quantityType(forIdentifier: .heartRate):
                    if (self.heartCounter != Int(self.measurement_counter)) {
                        let heartRateUnit = HKUnit.count().unitDivided(by: .minute())
                        self.lastHeartRate = statistics.mostRecentQuantity()?.doubleValue(for: heartRateUnit) ?? 0
                        
                        let today = Date()
                        self.heartTimesArray.append(today.toString(dateFormat: "yyyy-MM-dd-HH:mm:ss:SSS"))
                        self.heartRate.append(self.lastHeartRate)
                        
                        self.heartCounter += 1
                        if (self.heartCounter == Int(self.measurement_counter)) {
                            let even = Dictionary(uniqueKeysWithValues: zip(self.heartTimesArray, self.heartRate))
                            self.ref.child("users/\(self.userID ?? "N/A")/heartRate/\(self.activityString)").setValue(even)
                            if (self.hrvCounter == Int(self.measurement_counter)) {
                                self.end()
                            }
                        }
                    }
                case HKQuantityType.quantityType(forIdentifier: .heartRateVariabilitySDNN):
                    if (self.hrvCounter != Int(self.measurement_counter)) {
                        let ms = HKUnit.secondUnit(with: .milli)
                        //                    let heartRateUnit = HKUnit.count().unitDivided(by: .minute())
                        self.lastHRV = statistics.mostRecentQuantity()?.doubleValue(for: ms) ?? 0
                        
                        let today = Date()
                        self.hrvTimesArray.append(today.toString(dateFormat: "yyyy-MM-dd-HH:mm:ss:SSS"))
                        self.hrvRate.append(self.lastHRV)
                        
                        self.hrvCounter += 1
                        if (self.hrvCounter == Int(self.measurement_counter)) {
                            let even = Dictionary(uniqueKeysWithValues: zip(self.hrvTimesArray, self.hrvRate))
                            self.ref.child("users/\(self.userID ?? "N/A")/HRV/\(self.activityString)").setValue(even)
                            if (self.heartCounter == Int(self.measurement_counter)) {
                                self.end()
                            }
                        }
                    }
                default:
                    let value = statistics.sumQuantity()?.doubleValue(for: .meter())
                    self.totalDistance = value ?? 0
                    let kilometers = self.totalDistance / 1000
                    let distanceTime = CFAbsoluteTimeGetCurrent();
                    print("(distance time, distance) -> (" + String(distanceTime) + " , " + String(format: "%.3f", kilometers) + ")")
                }
            }
        }
    }
    public func getOxygenLevel(completion: @escaping (Double?, Error?) -> Void) {
        
        guard let oxygenQuantityType = HKQuantityType.quantityType(forIdentifier: .oxygenSaturation) else {
            fatalError("*** Unable to get oxygen saturation on this device ***")
        }
        
        HKHealthStore().requestAuthorization(toShare: nil, read: [oxygenQuantityType]) { (success, error) in
            
            guard error == nil, success == true else {
                completion(nil, error)
                return
            }
            
            let predicate = HKQuery.predicateForSamples(withStart: Date.distantPast, end: Date(), options: .strictEndDate)
            let query = HKStatisticsQuery(quantityType: oxygenQuantityType,
                                          quantitySamplePredicate: predicate,
                                          options: .mostRecent) { query, result, error in
                DispatchQueue.main.async {
                    
                    if let err = error {
                        completion(nil, err)
                    } else {
                        guard let level = result, let sum = level.mostRecentQuantity() else {
                            completion(nil, error)
                            return
                        }
                        print("Quantity : ", sum)   // It prints 97 % and I need 97 only
                        
                        let measureUnit0 = HKUnit(from: "%")
                        let count0 = sum.doubleValue(for: measureUnit0)
                        print("Count 0 : ", count0)   // It pronts 0.97 and I need 97 only
                        
                        completion(count0 * 100.0, nil)
                    }
                }
            }
            HKHealthStore().execute(query)
        }
    }
    
    func workoutBuilderDidCollectEvent(_ workoutBuilder: HKLiveWorkoutBuilder) {
        
    }
    
    func pause() {
        workoutSession?.pause()
    }
    
    func resume() {
        workoutSession?.resume()
    }
    
    func end() {
        workoutSession?.end()
    }
    
    private func save() {
        workoutBuilder?.endCollection(withEnd: Date()) { success, error in
            self.workoutBuilder?.finishWorkout { workout, error in
                DispatchQueue.main.async {
                    self.state = .inactive
                }
            }
        }
    }
}

extension Date {
    func toString( dateFormat format  : String ) -> String {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = format
        return dateFormatter.string(from: self)
    }
}

