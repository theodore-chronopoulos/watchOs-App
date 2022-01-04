import SwiftUI
import HealthKit

struct ContentView: View {
    
    @State private var selectedActivity = 0
    
    @StateObject var dataManager = DataManager()
    
    let activities: [(name: String, type: HKWorkoutActivityType)] = [
        ("Walking", .walking),
        ("Running", .running),
        ("Bike", .cycling),
        ("Ski", .downhillSkiing),
        ("Snowboard", .snowboarding)
    ]
    
    var body: some View {
        if dataManager.state == .inactive {
            VStack {
                Picker("Choose an Activity", selection: $selectedActivity) {
                    ForEach(0..<activities.count) { i in
                        Text(activities[i].name)
                    }
                }
                
                Button("Begin Workout")  {
                    guard HKHealthStore.isHealthDataAvailable() else { return }
                    
                    dataManager.activity = activities[selectedActivity].type
                    
                    dataManager.start()
                }
            }
        } else {
            WorkoutView(dataManager: dataManager)
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
