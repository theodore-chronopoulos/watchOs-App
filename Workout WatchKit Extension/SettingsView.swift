//
//  ContentView.swift
//  myFirstWatchApp WatchKit Extension
//
//  Created by Theodore Chronopoulos on 1/12/21.
//

import SwiftUI
import Firebase

struct SettingsView: View {
    @State var rootViewActive = false

    @State var username: String = ""
    @State var firstName: String = ""
    @State var lastName: String = ""
    @State private var userAge = 16
    @State var email: String = UserDefaults.standard.string(forKey: "username") ?? ""

    
    @State var isPrivate: Bool = true
    
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("PROFILE")) {
                    TextField("Username", text: $username)
                    TextField("First name", text: $firstName)
                    TextField("Lastname", text: $lastName)
                    TextField("Email", text: $email)
                    Picker(selection: $userAge, label: Text("Age")) {
                        ForEach(2 ..< 120) {
                            Text("\($0) years")
                        }
                    }
                    Toggle(isOn: $isPrivate) {
                        Text("Private Account")
                    }
                    
                }
                
                Section(header: Text("NOTIFICATIONS")) {
                    NavigationLink(destination: NotificationMenu()) {
                        Text("Notification Settings")
                    }
                }
                
                Section(header: Text("ABOUT")) {
                    HStack {
                        Text("Version")
                        Spacer()
                        Text("2.2.1")
                    }
                }
                Section {
                    Button(action: {
                        do {
                            try Auth.auth().signOut()
                            rootViewActive = true
                        }
                        catch let signOutError as NSError {
                            print("Error signing out: %@", signOutError)
                        }
                    }) {
                        NavigationLink(destination: LoginRegister(), isActive: $rootViewActive) {
                            EmptyView()
                        }
                        Text("SignOut")

                    }
                }
                Section {
                    Button(action: {
                        print("Perform an action here...")
                    }) {
                        Text("Reset All Settings")

                    }
                }
            }
            .navigationTitle("Settings")
        }
    }
}
struct SettingsView_Previews: PreviewProvider {
    static var previews: some View {
        SettingsView()
    }
}




