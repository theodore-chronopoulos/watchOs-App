//
//  ReceiveMessage.swift
//  Workout WatchKit Extension
//
//  Created by Theodore Chronopoulos on 15/4/22.
//


//  Used in https://rohitr.medium.com/get-started-with-firebase-realtime-db-and-watchos-84f3b70d36e


import FirebaseDatabase
import SwiftUI
import FirebaseAuth

//struct ReceiveMessage: View {
//    var messageManager = ApiManager()
//    
//    var body: some View {
//        Text(messageManager.message)
//            .padding().onAppear {
//                messageManager.startMessageListener()
//            }.onDisappear {
//                messageManager.stopMessageListener()
//            }
//    }
//}
struct ReceiveMessage: View {
//    var messageManager = ApiManager()
    var ref: DatabaseReference = Database.database().reference();
    var userID = Auth.auth().currentUser?.uid
//    lazy var messageRef: DatabaseReference = Database.database().reference().child("/message")
    
    
    var body: some View {
        Button(action: {
            ref.child("/message").getData(completion:  { error, snapshot in
                guard error == nil else {
                  print(error!.localizedDescription)
                  return;
                }
                let userName = snapshot.value as? String ?? "Unknown";
                let time = CFAbsoluteTimeGetCurrent();

                print("username: " + userName);
                print(time)
            });
            ref.child("users/\(userID ?? "N/A")/username").setValue("mitsos")
        }) {
            Text("Check-up")
        }
    }
}




