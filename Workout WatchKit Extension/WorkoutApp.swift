//
//  WorkoutApp.swift
//  Workout WatchKit Extension
//
//  Created by alex kropova on 2020-10-28.
//

import SwiftUI
import Firebase

@main
struct WorkoutApp: App {
    init(){
            FirebaseApp.configure()
        }
    @SceneBuilder var body: some Scene {
        WindowGroup {
            
            LoginRegister()
        }
        
        WKNotificationScene(controller: NotificationController.self, category: "myCategory")
    }
}
