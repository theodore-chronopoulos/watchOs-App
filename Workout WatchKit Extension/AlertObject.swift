
import Foundation
import HealthKit
import FirebaseAuth
import FirebaseDatabase

class AlertObject: NSObject, ObservableObject  {
    
    @Published var showInvalid: Bool = UserDefaults.standard.bool(forKey: "showInvalid")

}

