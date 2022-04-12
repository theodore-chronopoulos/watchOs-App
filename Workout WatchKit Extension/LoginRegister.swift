import SwiftUI

struct LoginRegister: View {
    
    var body: some View {
        NavigationView{
            VStack{
                NavigationLink(destination: RegisterView()) {
                    RegisterButtonView()
                }
                NavigationLink(destination: LoginView()) {
                    LoginButtonView()
                }
            }
        }.navigationBarTitle(Text("Register - Login"))
    }
}

struct LoginRegister_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            LoginRegister()
        }
    }
}
