import SwiftUI

struct WorkoutView: View {
    
    enum DisplayMode {
        case distance, heartRate, bodyTemperature, oxygenSat, bloodPressureSystolic, bloodPressureDiastolic
    }
    
    @State private var displayMode = DisplayMode.distance
    
    @ObservedObject var dataManager: DataManager
    
    var quantity: String {
        switch displayMode {
        case .distance:
            let kilometers = dataManager.totalDistance / 1000
            
            return String(format: "%.3f", kilometers)
        case .oxygenSat:
            let oxygenSat = dataManager.lastOxygenSaturation
            
            return String(oxygenSat)
        default:
            return String(Int(dataManager.lastHeartRate))
        }
    }
    
    var unit: String {
        switch displayMode {
        case .distance:
            return "km"
        case .oxygenSat:
            return "oxygen"
        default:
            return "Beats per minute"
        }
    }
    
    var body: some View {
        VStack {
            Group {
                Text(quantity)
                Text(unit)
            }
            .onTapGesture(perform: changeDisplayMode)
            
            if dataManager.state == .active {
                Button("Stop", action: dataManager.pause)
            } else {
                Button("Resume", action: dataManager.resume)
                Button("End", action: dataManager.end)
            }
        }
    }
    
    func changeDisplayMode() {
        switch displayMode {
        case .distance:
            displayMode = .heartRate
        case .heartRate:
            displayMode = .oxygenSat
        default:
            displayMode = .distance
        }
    }
}

struct WorkoutView_Previews: PreviewProvider {
    static var previews: some View {
        WorkoutView(dataManager: DataManager())
    }
}
