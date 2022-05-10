
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
    
    var numbers = [Double]()
    var counter = 0
    
    var healthStore = HKHealthStore()
    var workoutSession: HKWorkoutSession?
    var workoutBuilder: HKLiveWorkoutBuilder?
    
    var activity = HKWorkoutActivityType.walking
    
    @Published var state = WorkoutState.inactive
    @Published var totalDistance = 0.0
    @Published var lastHeartRate = 0.0
    @Published var lastOxygenSaturation = 0.0
    
    
    func start() {
        let sampleTypes: Set<HKSampleType> = [
            .workoutType(),
            .quantityType(forIdentifier: .heartRate)!,
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
                    let heartRateUnit = HKUnit.count().unitDivided(by: .minute())
                    self.lastHeartRate = statistics.mostRecentQuantity()?.doubleValue(for: heartRateUnit) ?? 0
                    let heartTime = CFAbsoluteTimeGetCurrent();
                    // create tuple with two elements
                    let product = (heartTime, Int(self.lastHeartRate))

                    // access tuple elements
                    print("(heart time, heart rate) -> (" + String(heartTime) + " , " + String(Int(self.lastHeartRate)) + ")")
                    print("(heart time, heart rate) -> " + String(product.0) + " " + String(product.1))
                    self.numbers.append(heartTime)
                    self.counter += 1
                    if (self.counter % 5 == 0) {
                        self.ref.child("users/\(self.userID ?? "N/A")/hearttime").setValue(self.numbers)
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

//// create tuple with two elements
//var product = ("MacBook", 1099.99)
//
//// access tuple elements
//print("Name:", product.0)
//print("Price:", product.1)
