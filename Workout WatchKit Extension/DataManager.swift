
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
    
    var hrvRate = [Int]()
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
    @Published var invalidMeasurement: Bool = false
//    @Published var invalidMeasurement: Bool = UserDefaults.standard.bool(forKey: "showInvalid")

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
        
        if (self.oxygenCounter == 0)   {
            getOxygenLevel { x,_ in
                self.lastOxygenSaturation = x ?? self.lastOxygenSaturation
                print(x ?? "0")
            }
        }
        if (self.hrvCounter == 0) {
            getHRVSampleQuery {x,_ in
                self.lastHRV = x ?? self.lastHRV

                print(x ?? "0")
            }
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
//                            self.sendRequest() { data in
//                                if let data = data {
//                                    print(data)
//                                    if (data == "true") {
//                                        self.invalidMeasurement = false
//                                        return
//                                    }
//                                }
//                            }
                            let lastminute = today.toString(dateFormat: "yyyy-MM-dd-HH:mm")
                            let even = Dictionary(uniqueKeysWithValues: zip(self.heartTimesArray, self.heartRate))
                            self.ref.child("users/\(self.userID ?? "N/A")/heartRate/\(self.activityString)/\(lastminute)").setValue(even)
                            self.ref.child("users/\(self.userID ?? "N/A")/lastType").setValue(self.activityString)
                            self.ref.child("users/\(self.userID ?? "N/A")/lastTimestamp").setValue(lastminute)
                            self.end()
//                            if (self.oxygenCounter == 1) {
//                                self.end()
//                            }
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
    func getHRVSampleQuery(completion: @escaping (Double?, Error?) -> Void) {
        guard let HRVType = HKQuantityType.quantityType(forIdentifier: .heartRateVariabilitySDNN) else {
            fatalError("*** Unable to get oxygen saturation on this device ***")
        }
        
        HKHealthStore().requestAuthorization(toShare: nil, read: [HRVType]) { (success, error) in
            
            guard error == nil, success == true else {
                completion(nil, error)
                return
            }
            print("mpikame hrv")
            
            
            let predicate = HKQuery.predicateForSamples(withStart: Date.distantPast, end: Date(), options: .strictEndDate)
            let query = HKStatisticsQuery(quantityType: HRVType,
                                          quantitySamplePredicate: predicate,
                                          options: .mostRecent) { query, result, error in
                DispatchQueue.main.async {
                    if(error == nil) {
                        guard let level = result, let sum = level.mostRecentQuantity() else {
                            completion(nil, error)
                            print("fuck")
                            return
                        }
                        print("Startdate")
                        print(sum)
                        let myresult = sum.doubleValue(for: HKUnit.secondUnit(with: .milli))
                        print(myresult)
                        
                        let today = Date()
                        self.hrvTimesArray.append(today.toString(dateFormat: "yyyy-MM-dd-HH:mm:ss"))
                        self.hrvRate.append(Int(myresult))
                        self.hrvCounter = 1
                        
                        
                        let hrvfinal = Dictionary(uniqueKeysWithValues: zip(self.hrvTimesArray, self.hrvRate))
                        let lastminute = today.toString(dateFormat: "yyyy-MM-dd-HH:mm")
                        
                        self.ref.child("users/\(self.userID ?? "N/A")/hrv/\(lastminute)").setValue(hrvfinal)
                        if (self.heartCounter == Int(self.measurement_counter)) {
                            self.end()
                        }
                        
                        completion(myresult,nil)
                    }
                }
            }
            HKHealthStore().execute(query)
            
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
            print("mpikame")
            
            
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
                            print("fuck")
                            return
                        }
                        if (self.oxygenCounter == 0) {
                            print("Quantity : ", sum)   // It prints 97 % and I need 97 only
                            
                            let measureUnit0 = HKUnit(from: "%")
                            let count0 = sum.doubleValue(for: measureUnit0)
                            print("Count 0 : ", count0)   // It pronts 0.97 and I need 97 only
                            let today = Date()
                            self.oxygenTimesArray.append(today.toString(dateFormat: "yyyy-MM-dd-HH:mm:ss:SSS"))
                            self.oxygen.append(count0 * 100.0)
                            //                            self.oxygen.append(98.0)
                            self.oxygenCounter = 1
                            let oxygenfinal = Dictionary(uniqueKeysWithValues: zip(self.oxygenTimesArray, self.oxygen))
                            let lastminute = today.toString(dateFormat: "yyyy-MM-dd-HH:mm")
                            
                            self.ref.child("users/\(self.userID ?? "N/A")/oxygen/\(lastminute)").setValue(oxygenfinal)
                            if (self.heartCounter == Int(self.measurement_counter)) {
                                self.end()
                            }
                            
                            completion(count0 * 100.0, nil)
                        }
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
                        self.sendRequest() { data in
                            if let data = data {
                                // do something
                                print(data)
                                if (data == "true") {
//                                    self.invalidMeasurement = true
//                                    let defaults = UserDefaults.standard
//                                    defaults.set(true, forKey: "showInvalid")
//                                    defaults.synchronize()
                                    self.invalidMeasurement = true
                                }
                            }
                        }
                        self.state = .inactive
                    }
                    
                }
            }
        }
        func sendRequest (completion: @escaping (String?)->()){
            let userIdString: String = String(self.userID ?? "")
            let urlString = "https://us-central1-healthwatchapp-e636f.cloudfunctions.net/validatemeasurement?uid=" + userIdString
            if let url = URL(string: urlString) {
                print(url)
                URLSession.shared.dataTask(with: url ) { data, response, error in
                    if error == nil {
                        if let data = data {
                            if let jsonString = String(data: data, encoding: .utf8) {
                                print(jsonString)
                                return completion(jsonString)
                            }
                        }
                    }else{
                        print(error ?? "Error")
                        return completion(nil)
                    }
                }.resume()
            }
            else {
                print("skata")
                return completion(nil)
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

