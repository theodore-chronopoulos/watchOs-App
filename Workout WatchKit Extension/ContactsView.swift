//
//  ContactsView.swift
//  myFirstWatchApp WatchKit Extension
//
//  Created by Theodore Chronopoulos on 3/12/21.
//

import SwiftUI

struct SearchBar: View {
    @Binding var text: String

    @State private var isEditing = false

    var body: some View {
        HStack {

            TextField("Search ...", text: $text)
                .cornerRadius(8)
                .onTapGesture {
                    self.isEditing = true
                }
            

            if isEditing {
                Button(action: {
                    self.isEditing = false
                    self.text = ""

                }) {
                    Text("Cancel")
                }
                .padding(.trailing, 10)
                .transition(.move(edge: .trailing))
            }
        }
    }
}

struct Contact: Identifiable {
    let id = UUID()
    let name: String
    var phone: String?
}

struct ContactRow: View {
    var contact: Contact

    var body: some View {
        Text(contact.name)
    }
}

struct ContactsView: View {
    @State private var previewIndex = 0
    @State private var searchText = ""

    var contacts = [
        Contact(name: "Joe"),
        Contact(name: "Ross"),
        Contact(name: "Rachel"),
        Contact(name: "Chandler"),
        Contact(name: "Monica"),
        Contact(name: "Phoebe")
        ]
    
    var body: some View {
        let newArr = contacts.sorted { $0.name < $1.name }
        
        NavigationView{
            Form {
                SearchBar(text: $searchText)
                Section(header: Text("NAME")){
//                    List(newArr) { contact in
//                                ContactRow(contact: contact)
//                    }
                    List(newArr.filter({ searchText.isEmpty ? true : $0.name.contains(searchText) })) { item in
                        Text(item.name)
                    }
                }
                Section(header: Text("ACTIONS")) {
                    Button(action: {
                        print("Perform an action here...")
                    }) {
                        Text("Add a contact...")
                    }
                    Button(action: {
                        print("Perform an action here...")
                    }) {
                        Text("Remove a contact...")
                    }
                }
            }
        }.navigationTitle("Contacts")
    }
}

struct ContactsView_Previews: PreviewProvider {
    static var previews: some View {
        ContactsView()
    }
}


