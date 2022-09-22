import SwiftUI
import HealthKit

struct WorkoutMenuView: View {
    
    @State private var selectedActivity = 0
    
    @StateObject var dataManager = DataManager()
    
    let activities: [(name: String, type: HKWorkoutActivityType)] = [
        ("Resting", .walking),
        ("Walking", .walking),
        ("Running", .running),
        ("Bike", .cycling),
        ("Ski", .downhillSkiing),
        ("Snowboard", .snowboarding)
    ]
    let messageString: String = "\n Don't forget to measure your Oxygen levels through Oxygen App, before you begin your measurement."
    let measurementString: String = "\n Your last measurement was not in the expected boundaries. Please redo the measurement."
    
    @State private var alertShouldBeShown = true
    
    
    var body: some View {
        NavigationView {
            if dataManager.state == .inactive {
                VStack {
                    if #available(watchOSApplicationExtension 8.0, *) {
                        Picker("Choose an Activity", selection: $selectedActivity) {
                            ForEach(0..<activities.count, id:\.self) { i in
                                Text(activities[i].name)
                            }
                        }
                        .alert(isPresented: $alertShouldBeShown, content: {
                            
                            Alert(title: Text("Oxygen levels"),
                                  message: Text(messageString),
                                  dismissButton: Alert.Button.default(
                                    Text("Dismiss"), action: {
                                        alertShouldBeShown = false
                                    })
                            )
                        })
                        Button("Begin Measurement")  {
                            guard HKHealthStore.isHealthDataAvailable() else { return }
                            
                            dataManager.activity = activities[selectedActivity].type
                            dataManager.activityString = activities[selectedActivity].name
                            dataManager.start()
                            
                        }
                        .alert(isPresented: $dataManager.invalidMeasurement, content: {
                            
                            Alert(title: Text("Invalid measurement"),
                                  message: Text(measurementString),
                                  dismissButton: Alert.Button.default(
                                    Text("Dismiss"), action: {
                                        dataManager.invalidMeasurement = false
//                                        let defaults = UserDefaults.standard
//                                        defaults.set(false, forKey: "showInvalid")
//                                        defaults.synchronize()
                                    })
                            )
                        })
                    } else {
                        Picker("Choose an Activity", selection: $selectedActivity) {
                            ForEach(0..<activities.count, id:\.self) { i in
                                Text(activities[i].name)
                            }
                        }
                        Button("Begin Measurement")  {
                            guard HKHealthStore.isHealthDataAvailable() else { return }
                            dataManager.activity = activities[selectedActivity].type
                            dataManager.activityString = activities[selectedActivity].name
                            dataManager.start()
                        }
                    }
                }
            }
            else {
                WorkoutView(dataManager: dataManager)
            }
        }
    }
}

struct WorkoutMenuView_Previews: PreviewProvider {
    static var previews: some View {
        WorkoutMenuView()
    }
}
