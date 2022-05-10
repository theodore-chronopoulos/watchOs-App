//
//  NotificationMenu.swift
//  Workout WatchKit Extension
//
//  Created by Theodore Chronopoulos on 10/5/22.
//

import Foundation
import SwiftUI
import WatchKit
import Firebase
import FirebaseDatabase

struct NotificationMenu: View {
    
    @StateObject var notification = createNotification()
    @State private var isToggled = false
    
    var body: some View {
        let binding = Binding(
            get: { self.isToggled },
            set: {
                potentialAsyncFunction($0)
            }
        )
        func potentialAsyncFunction(_ newState: Bool) {
            //something async
            self.isToggled = newState
            let userID = Auth.auth().currentUser?.uid
            let ref: DatabaseReference = Database.database().reference()
            if newState == true {
                notification.allowNotification()
                ref.child("users/\(userID ?? "N/A")/allow_notifications").setValue("true")
                //                        notification.scheduleNotification()
            }
            else {
                ref.child("users/\(userID ?? "N/A")/allow_notifications").setValue("false")
            }
        }
        return Toggle("Allow notifications", isOn: binding)
    }
}

class InterfaceController: WKInterfaceController {
    
    // MARK: - Properties
    
    @IBOutlet weak var label: WKInterfaceLabel!
    @IBOutlet weak var slider: WKInterfaceSlider!
    
    // MARK: - Interface Callback Methods
    
    @IBAction func sliderValueChanged(value: Float) {
        let roundedValue = Int(round(value))
        self.label.setText("\(roundedValue)")
    }
}

//let email = UserDefaults.standard.string(forKey: "username")
//let password = UserDefaults.standard.string(forKey: "password")
