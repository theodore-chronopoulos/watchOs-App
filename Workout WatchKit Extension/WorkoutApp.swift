//
//  WorkoutApp.swift
//  Workout WatchKit Extension
//
//  Created by alex kropova on 2020-10-28.
//

import SwiftUI
import Firebase
import FirebaseAuth

@main
struct WorkoutApp: App {
    @State var email = UserDefaults.standard.string(forKey: "username") ?? "notanemail"
    @State var password = UserDefaults.standard.string(forKey: "password")  ?? "notanemail"
//    print("hello")
    init() {
        FirebaseApp.configure()
    }
    
    @SceneBuilder var body: some Scene {
        WindowGroup {
            if email == "notanemail" || password == "notanemail" {
                LoginRegister()
            }
            else {
                LoginView()
            }
        }
        WKNotificationScene(controller: NotificationController.self, category: "myCategory")
    }
}
