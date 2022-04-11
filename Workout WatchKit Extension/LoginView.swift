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
    
    var body: some View {
        Form {
            Section {
                TextField("Email", text: $email)
            }
            Section {
                SecureField("Password", text: $password)
            }
            Section {
                NavigationLink(destination: Auth.auth().createUser(withEmail: email, password: password) { authResult, error in
                    if let e = error {
                        print(e)
                    }
                    else {
                        MainMenu()
                    }
                  }) {
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



//import UIKit
//import Firebase

//class LoginViewController: UIViewController {
//
//    @IBOutlet weak var emailTextfield: UITextField!
//    @IBOutlet weak var passwordTextfield: UITextField!
//    @IBAction func loginPressed(_ sender: UIButton) {
//        if let email = emailTextfield.text, let password = passwordTextfield.text {
//            Auth.auth().signIn(withEmail: email, password: password) { authResult, error in
//                if let e = error {
//                    print(e)
//                } else {
//                    self.performSegue(withIdentifier: K.loginSegue, sender: self)
//                }
//            }
//        }
//    }
//}
