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
                            mainViewActive = true
                        }
                    }
                }) {
                    NavigationLink(destination: MainMenu(), isActive: $mainViewActive) {
                        EmptyView()
                    }
                    LoginButtonView()
                }
            }.frame(
                minWidth: 0,
                maxWidth: .infinity)
        }.navigationBarTitle(Text("Login"))
    }
}

struct Login_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            LoginView()
        }
    }
}
