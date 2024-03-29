//
//  MainMenu.swift
//  myFirstWatchApp WatchKit Extension
//
//  Created by Theodore Chronopoulos on 2/12/21.
//

import SwiftUI
import FirebaseAuth


struct MainMenu: View {
    
    var body: some View {
        NavigationView {
            Form {
                Section {
                    NavigationLink(destination: WorkoutMenuView()) {
                        Text("Measurement")
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
