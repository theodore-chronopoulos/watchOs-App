//
//  WorkoutApp.swift
//  Workout WatchKit Extension
//
//  Created by alex kropova on 2020-10-28.
//

import SwiftUI

@main
struct WorkoutApp: App {
    @SceneBuilder var body: some Scene {
        WindowGroup {
            NavigationView {
                ContentView()
            }
        }

        WKNotificationScene(controller: NotificationController.self, category: "myCategory")
    }
}
