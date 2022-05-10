//
//  MainMenu.swift
//  myFirstWatchApp WatchKit Extension
//
//  Created by Theodore Chronopoulos on 2/12/21.
//

import SwiftUI
import FirebaseAuth
import UserNotifications


struct MainMenu: View {
    
    var body: some View {
        NavigationView {
            Form {
                Section {
                    NavigationLink(destination: NotificationMenu()) {
                        //                        let userID = Auth.auth().currentUser?.uid
                        //                        let email = UserDefaults.standard.string(forKey: "username")
                        //                        let password = UserDefaults.standard.string(forKey: "password")
                        Text("Notifications")
                    }
                }
                Section {
                    NavigationLink(destination: WorkoutMenuView()) {
                        Text("Workout")
                    }
                }
                Section {
                    NavigationLink(destination: ReceiveMessage()) {
                        Text("History")
                    }
                }
                Section {
                    NavigationLink(destination: ContactsView()) {
                        Text("Contacts")
                    }
                }
                
                Section {
                    NavigationLink(destination: SettingsView()) {
                        Text("Settings")
                    }
                }
            }
            
        }.navigationBarHidden(true)
    }
}

struct MainMenu_Previews: PreviewProvider {
    static var previews: some View {
        MainMenu()
    }
}
