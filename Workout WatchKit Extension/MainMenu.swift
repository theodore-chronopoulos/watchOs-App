//
//  MainMenu.swift
//  myFirstWatchApp WatchKit Extension
//
//  Created by Theodore Chronopoulos on 2/12/21.
//

import SwiftUI

struct MainMenu: View {
    
    var body: some View {
        NavigationView {
            Form {
                Section {
                    Button(action: {
                        print("Perform an action here...")
                    }) {
                        Text("Check-up")
                    }
                }
                Section {
                    NavigationLink(destination: WorkoutMenuView()) {
                        Text("Workout")
                    }
                }
                Section {
                    Button(action: {
                        print("Perform an action here...")
                                          }) //                        .setImage(UIImage(systemName: "search"))
                    {
                        Text("History")
                    }
                }
//                Section {
//                    NavigationLink(destination: ContentView()) {
//                        Text("Settings")
//                    }
//                }
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
