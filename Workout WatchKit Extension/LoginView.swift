//
//  LoginView.swift
//  Workout WatchKit Extension
//
//  Created by Theodore Chronopoulos on 8/4/22.
//

import Foundation
import SwiftUI
import WatchKit
import Firebase


struct LoginView: View {
    @State var email: String = UserDefaults.standard.string(forKey: "username") ?? ""
    @State var password: String = UserDefaults.standard.string(forKey: "password") ?? ""
    @State var mainViewActive = false
    
    var body: some View {
        NavigationView{
            Form {
                Section {
                    if #available(watchOSApplicationExtension 8.0, *) {
                        TextField("Email", text: $email).disableAutocorrection(true)
                    } else {
                        TextField("Email", text: $email)
                    }
                }
                Section {
                    SecureField("Password", text: $password)
                }
                Section {
                    Button(action: {
                        Auth.auth().signIn(withEmail: email, password: password) { authResult, error in
                            if let e = error {
                                print(e)
                            }
                            else {
                                print("email " + email)
                                print("password " + password)
                                // Userdefaults helps to store session data locally
                                let defaults = UserDefaults.standard
                                defaults.set(email, forKey: "username")
                                defaults.set(password, forKey: "password")
                                defaults.synchronize()
                                mainViewActive = true
                                print(mainViewActive)
                            }
                        }
                        if let savedData = UserDefaults.standard.string(forKey: "username") {
                            print(savedData)
                            //perform your task on success
                        }
                        if let savedData2 = UserDefaults.standard.string(forKey: "password") {
                            print(savedData2)
                            //perform your task on success
                        }
                    }) {
                        
                        VStack {
                            NavigationLink(destination: MainMenu(), isActive: $mainViewActive) {
                                LoginButtonView()
                            }
                        }
                    }
                }.frame(
                    minWidth: 0,
                    maxWidth: .infinity)
            }.navigationBarTitle(Text("Login"))
        }.navigationViewStyle(.stack)
    }
}

struct Login_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            LoginView()
        }
    }
}
