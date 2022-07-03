import SwiftUI

struct WorkoutView: View {
    
    @ObservedObject var dataManager: DataManager

    lazy var oxygen: String = String(dataManager.lastOxygenSaturation)
    lazy var distance: String = String(format: "%.0f", dataManager.totalDistance)
    lazy var heartRate: String = String(Int(dataManager.lastHeartRate))
    lazy var hrv: String = String(Int(dataManager.lastHRV))

    func oxygenValue() -> String {
        var mutatableSelf = self
        return mutatableSelf.oxygen
    }
    func distanceValue() -> String {
        var mutatableSelf = self
        return mutatableSelf.distance
    }
    func heartRateValue() -> String {
        var mutatableSelf = self
        return mutatableSelf.heartRate
    }
    func hrvValue() -> String {
        var mutatableSelf = self
        return mutatableSelf.hrv
    }
    lazy var array:[String] = ["Distance " , distanceValue() , " m"]

    var body: some View {
        VStack {
            Group {
                HStack {
                    Text("Distance:")
                    Spacer()
                    Text(distanceValue() + " m")
                }
                HStack {
                    Text("Heart rate:")
                    Spacer()
                    Text(heartRateValue() + " bpm")
                }
                HStack {
                    Text("Last HRV:")
                    Spacer()
                    Text(hrvValue() + " ms")
                }
                HStack {
                    Text("Last Oxygen:")
                    Spacer()
                    Text(oxygenValue() + " %")
                }
            }
            .frame(width: 160.0)
            if dataManager.state == .active {
                Button("Stop", action: dataManager.pause)
            }
            else {
                Button("Resume", action: dataManager.resume)
                Button("End", action: dataManager.end)
            }
        }
    }
}

struct WorkoutView_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            WorkoutView(dataManager: DataManager())
        }
    }
}
