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
    let meaaageString: String = "\n Don't forget to measure your Oxygen levels through Oxygen App, before you begin your measurement."
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
                                  message: Text(meaaageString),
                                  dismissButton: Alert.Button.default(
                                    Text("Dismiss"), action: {
                                        alertShouldBeShown = false
                                    })
                            )
                        })
                    } else {
                        Picker("Choose an Activity", selection: $selectedActivity) {
                            ForEach(0..<activities.count, id:\.self) { i in
                                Text(activities[i].name)
                            }
                        }                    }
                    Button("Begin Measurement")  {
                        guard HKHealthStore.isHealthDataAvailable() else { return }
                        
                        dataManager.activity = activities[selectedActivity].type
                        dataManager.activityString = activities[selectedActivity].name
                        dataManager.start()
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
