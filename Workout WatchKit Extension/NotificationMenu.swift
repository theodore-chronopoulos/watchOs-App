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
    @State private var score = 0
    @State private var repeat_time = UserDefaults.standard.float(forKey: "repeat_time")
    @State private var measurement_counter = UserDefaults.standard.float(forKey: "measurement_counter")
    @State private var flag: Bool = UserDefaults.standard.bool(forKey: "notifications")
    @State private var previewIndex = 0
    var previewOptions = ["Ring", "Vibrate", "Silent"]
    
    
    let formatter: NumberFormatter = {
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        return formatter
    }()
    
    var body: some View {
        let binding = Binding(
            get: { UserDefaults.standard.bool(forKey: "notifications") },
            set: {
                potentialAsyncFunction($0)
            }
        )
        func potentialAsyncFunction(_ newState: Bool) {
            self.flag = newState
            let userID = Auth.auth().currentUser?.uid
            let ref: DatabaseReference = Database.database().reference()
            UserDefaults.standard.set(newState, forKey: "notifications")
            UserDefaults.standard.synchronize()
            
            if newState == true {
                notification.allowNotification()
                ref.child("users/\(userID ?? "N/A")/allow_notifications").setValue("true")
                notification.scheduleNotification(repeat_time: repeat_time)
            }
            else {
                notification.removeNotification()
                ref.child("users/\(userID ?? "N/A")/allow_notifications").setValue("false")
            }
        }
        return Form {
            Section (header: Text("Notifications")){
                Toggle("Notifications", isOn: binding)
                Text("Notify me every " + String(format: "%.0f", repeat_time) + " hours.").disabled(self.flag == false)
                Slider(
                    value: Binding(get: {
                        self.repeat_time
                    }, set: { (newVal) in
                        self.repeat_time = newVal
                        self.repeatSliderChanged()
                    }),
                    in: 1...24,
                    step: 1
                ).padding(.all).disabled(self.flag == false)
                Picker(selection: $previewIndex, label: Text("Sound Mode")) {
                    ForEach(0 ..< previewOptions.count, id:\.self) {
                        Text(self.previewOptions[$0])
                    }
                }
            }
            Section (header: Text("Measurement")){
                Text("Take " + String(format: "%.0f", self.measurement_counter) + " in every measurement.")
                Slider(
                    value: Binding(get: {
                        self.measurement_counter
                    }, set: { (newValue) in
                        self.measurement_counter = newValue
                        self.measurementSliderChanged()
                    }),
                    in: 5...100,
                    step: 5
                ).padding(.all)
            }
        }
    }
    func repeatSliderChanged() {
        notification.scheduleNotification(repeat_time: repeat_time)
        let userID = Auth.auth().currentUser?.uid
        let ref: DatabaseReference = Database.database().reference()
        UserDefaults.standard.set(repeat_time, forKey: "repeat_time")
        UserDefaults.standard.synchronize()
        ref.child("users/\(userID ?? "N/A")/repeat_time").setValue(repeat_time)
    }
    func measurementSliderChanged() {
        let userID = Auth.auth().currentUser?.uid
        let ref: DatabaseReference = Database.database().reference()
        UserDefaults.standard.set(measurement_counter, forKey: "measurement_counter")
        UserDefaults.standard.synchronize()
        ref.child("users/\(userID ?? "N/A")/measurement_counter").setValue(measurement_counter)
    }
}
