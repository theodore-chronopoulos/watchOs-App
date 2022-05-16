//
//  ScheduleNotification.swift
//  Workout WatchKit Extension
//
//  Created by Theodore Chronopoulos on 9/5/22.
//

import Foundation
import UserNotifications
import UserNotificationsUI


class createNotification: ObservableObject {
    
    func allowNotification() {
        let center = UNUserNotificationCenter.current()
        
        center.requestAuthorization(options: [.alert, .badge, .sound]) { (granted, error) in
            if granted {
                print("Yay!")
            } else {
                print("D'oh")
            }
        }
    }
    
    func scheduleNotification(repeat_time: Float) {
        let hours: Double = Double(repeat_time)
        // Remove old notification if existed
        self.removeNotification()
        
        // Save new notication id
        let notification_id = UUID().uuidString
        let defaults = UserDefaults.standard
        defaults.set(notification_id, forKey: "notification_id")
        defaults.synchronize()
        
        //Create new notification
        let center = UNUserNotificationCenter.current()
        let content = UNMutableNotificationContent()
        
        content.title = "Wake up call"
        content.body = "Its time to measure your vital signs. Next measurement in " + String(format: "%.0f", hours) + " hours."
        content.categoryIdentifier = "alarm"
        content.userInfo = ["customData": "fizzbuzz"]
        content.sound = UNNotificationSound.default
        
        var dateComponents = DateComponents()
        dateComponents.hour = 10
        dateComponents.minute = 30
        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 60 * hours, repeats: true)
//        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 60, repeats: true)
        
        let request = UNNotificationRequest(identifier: notification_id, content: content, trigger: trigger)
        center.add(request)
    }
    
    func removeNotification() {
        let notification_id = UserDefaults.standard.string(forKey: "notification_id")
        UNUserNotificationCenter.current().getPendingNotificationRequests { (reqs) in
            var ids =  [String]()
            reqs.forEach {
                if $0.identifier == notification_id {
                    ids.append($0.identifier)
                }
            }
            UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers:ids)
        }
    }
}
