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
import FirebaseDatabase
import FirebaseAuth


struct LoginView: View {
    @State var email: String = UserDefaults.standard.string(forKey: "username") ?? ""
    @State var password: String = UserDefaults.standard.string(forKey: "password") ?? ""
    @State var mainViewActive = false
    @State var ref: DatabaseReference = Database.database().reference();
    @State var userID = Auth.auth().currentUser?.uid ?? "Unknown"
    @StateObject var notification = createNotification()

    
    var body: some View {
        NavigationView{
            Form {
                Section(header: Text("EMAIL")) {
                    if #available(watchOSApplicationExtension 8.0, *) {
                        TextField("Email", text: $email).disableAutocorrection(true)
                    } else {
                        TextField("Email", text: $email)
                    }
                }
                Section(header: Text("PASSWORD")) {
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
                                
                                // check to see if repeat time is correct
                                let allow_flag: Bool = defaults.bool(forKey: "notifications")
                                if allow_flag == true {
                                    // check for time notication etc from database
                                    print("he allows")
                                    ref.child("/users/\(userID)/repeat_time").getData(completion:  { error, snapshot in
                                        guard error == nil else {
                                          print(error!.localizedDescription)
                                          return;
                                        }
                                        let repeat_time = snapshot.value as? Float ?? 8.0
                                        print(repeat_time)
                                        if repeat_time == UserDefaults.standard.float(forKey: "repeat_time"){
                                            print("saved correctly")
                                        }
                                        else {
                                            print("changed remotely have to set new notification")
                                            notification.scheduleNotification(repeat_time: repeat_time)
                                            defaults.set(repeat_time, forKey: "repeat_time")
                                        }
                                    });
                                    ref.child("/users/\(userID)/measurement_counter").getData(completion:  { error, snapshot in
                                        guard error == nil else {
                                          print(error!.localizedDescription)
                                          return;
                                        }
                                        let measurement_counter = snapshot.value as? Float ?? 8.0
                                        print(measurement_counter)
                                        if measurement_counter == UserDefaults.standard.float(forKey: "measurement_counter"){
                                            print("saved correctly")
                                        }
                                        else {
                                            print("changed remotely have to set new measurement")
                                            defaults.set(measurement_counter, forKey: "measurement_counter")
                                        }
                                    });
                                }
                                defaults.set(email, forKey: "username")
                                defaults.set(password, forKey: "password")
                                defaults.synchronize()
                                mainViewActive = true
                            }
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
