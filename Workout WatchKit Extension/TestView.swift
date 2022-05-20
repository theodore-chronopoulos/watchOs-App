import SwiftUI

struct TestView: View {
    
    @ObservedObject var dataManager: DataManager

    lazy var oxygen: String = String(dataManager.lastOxygenSaturation)
    lazy var distance: String = String(format: "%.0f", dataManager.totalDistance)
    lazy var heartRate: String = String(Int(dataManager.lastHeartRate))
    
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

    var body: some View {
        VStack {

        }
    }
}


struct TestView_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            TestView(dataManager: DataManager())
        }
    }
}
