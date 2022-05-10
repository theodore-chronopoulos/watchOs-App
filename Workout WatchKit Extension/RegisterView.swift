//
//  RegisterView.swift
//  Workout WatchKit Extension
//
//  Created by Theodore Chronopoulos on 8/4/22.
//

import Foundation
import SwiftUI
import WatchKit
import Firebase
import FirebaseDatabase

struct RegisterView: View {
    @State var email: String = ""
    @State var password: String = ""
    @State var mainViewActive = false
    
    var body: some View {
        Form {
            Section {
                if #available(watchOSApplicationExtension 8.0, *) {
                    TextField("Email", text: $email).disableAutocorrection(true)
                } else {
                    // Fallback on earlier versions
                }
                Text("Enter a valid email.")
                    .font(.caption2)
            }
            Section {
                SecureField("Password", text: $password)
                Text("Password must be 6 characters long or more.")
                    .font(.caption2)
            }
            Section {
                Button(action: {
                    Auth.auth().createUser(withEmail: email, password: password) { authResult, error in
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
                            let userID = Auth.auth().currentUser?.uid
                            let ref: DatabaseReference = Database.database().reference()
                            ref.child("users/\(userID ?? "N/A")/allow_notifications").setValue("false")
                            ref.child("users/\(userID ?? "N/A")/email").setValue(email)
                            mainViewActive = true
                        }
                    }
                }) {
                    NavigationLink(destination: MainMenu(), isActive: $mainViewActive) {
                        EmptyView()
                    }
                    RegisterButtonView()
                }
            }.frame(
                minWidth: 0,
                maxWidth: .infinity)
        }.navigationBarTitle(Text("Register"))
    }
}
struct Register_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            RegisterView()
        }
    }
}
