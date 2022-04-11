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
//        case .bloodPressureSystolic:
//            let systolicPressure = dataManager.lastBloodPressureSystolic
//
//            return String(systolicPressure)
//        case .bloodPressureDiastolic:
//            let diastolicPressure = dataManager.lastBloodPressureDiastolic
//
//            return String(diastolicPressure)
//        case .bodyTemperature:
//            let bodyCelsius = dataManager.lastBodyTemperature
//
//            return String(bodyCelsius)
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
//        case .bloodPressureSystolic:
//            return "systolic"
//        case .bloodPressureDiastolic:
//            return "diastolic"
//        case .bodyTemperature:
//            return "˚Co"
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
//        case .oxygenSat:
//            displayMode = .distance
        default:
            displayMode = .distance
//        case .bodyTemperature:
//            displayMode = .heartRate
//        case .bloodPressureSystolic:
//            displayMode = .bloodPressureDiastolic
        
        }
    }
}

struct WorkoutView_Previews: PreviewProvider {
    static var previews: some View {
        WorkoutView(dataManager: DataManager())
    }
}
