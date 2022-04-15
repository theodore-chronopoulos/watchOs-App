//
//  ApiManager.swift
//  Workout WatchKit Extension
//
//  Created by Theodore Chronopoulos on 13/4/22.
//  Thanks to:
//  https://medium.com/firebase-developers/get-started-with-firebase-realtime-db-and-watchos-84f3b70d36e
//  Used in https://rohitr.medium.com/get-started-with-firebase-realtime-db-and-watchos-84f3b70d36e



import FirebaseDatabase
import Foundation

class ApiManager: ObservableObject {
    @Published var message = "Does it work?"
    lazy var messageRef: DatabaseReference = Database.database().reference().child("/message")
    var messageHandle: DatabaseHandle?
    
    func startMessageListener() {
        messageHandle = messageRef.observe(.value, with: { snapshot in
            if let value = snapshot.value as? String{
                self.message = value
            }
        })
    }
    
    func stopMessageListener() {
        if messageHandle != nil {
            messageRef.removeObserver(withHandle: messageHandle!)
        }
    }
}
