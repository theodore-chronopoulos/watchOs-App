import React from 'react';
import './AboutUs.css';
import watch from "../../logos/apple-watch-series-7.webp";
import sensors from "../../logos/sensors.png";
import profile from "../../logos/profile.jpeg";
import users from "../../logos/users.jpeg";
import ChoicesBoxesLoggedIn from "../ChoicesBoxesLoggedIn/ChoicesBoxesLoggedIn";


import { Link } from 'react-router-dom';

class AboutUs extends React.Component {
    render() {
        return (
            <div>
                <div className='page-title'>
                    <b>About us</b>
                </div>
                <div className='section'>
                    <div className='section_title'>
                        <b>Γενικά</b>
                    </div>
                    <div className='text-image'>
                        <div className='section-text'>
                            Τις τελευταίες δεκαετίες, παράλληλα με τη ραγδαία ανάπτυξη του συνόλου του
                            κλάδου της τεχνολογίας, παρατηρείται αξιοσημείωτη εξέλιξη και στις έξυπνες
                            συσκευές, οι οποίες  διεισδύουν ολοένα και περισσότερο στην καθημερινότητά
                            μας και προτιμώνται λόγω των συγκριτικών και αδιαμφισβήτητων πλεονεκτημάτων
                            που παρουσιάζουν, διευκολύνοντας την καθημερινότητα του χρήστη. Μια τέτοια
                            έξυπνη συσκευή που με το πέρασμα του χρόνου όλο και περισσότεροι άνθρωποί
                            επιλέγουν, είναι τα έξυπνα ρολόγια. Ανάμεσα σε ποικίλες δυνατότητες που
                            προσφέρουν, τα έξυπνα ρολόγια συλλέγουν live δεδομένα για την ζωτική κατάσταση
                            του χρήστη με σκοπό την παρακολούθηση της πορείας κατά την διάρκεια της
                            αθλητικής δραστηριότητας, την πρόληψη ατυχημάτων, την έγκυρη ενημέρωση του
                            γιατρού, αλλά και την συνεχή μελέτη ενός ασθενή. Έτσι, όλες οι μεγάλες
                            τεχνολογικές εταιρείες έχουν στραφεί στην παραγωγή τέτοιων ρολογιών που
                            μέσω των αισθητήρων που διαθέτουν, δίνουν την δυνατότητα στους προγραμματιστές
                            να αναπτύξουν εφαρμογές που παρακολουθούν τις ζωτικές ενδείξεις του χρήστη και
                            βγάζουν τα κατάλληλα συμπεράσματα. Στο πλαίσιο αυτό, στόχος της παρούσας
                            εργασίας ήταν η ανάπτυξη αυτόνομης εφαρμογής για το Apple Watch Series 7
                            με σκοπό την συνεχή καταγραφή του δείκτη στρες (HRV), και την συσχέτισή του
                            με την πρόσφατη ποιότητα ύπνου. Η εφαρμογή αυτή καταγράφει τις μετρήσεις για
                            τους καρδιακούς παλμούς, καθώς και το ποσοστό οξυγόνου στο αίμα με την βοήθεια
                            των ειδικών αισθητήρων που διαθέτει ο συγκεκριμένος τύπος ρολογιού. Στη συνέχεια
                            οι μετρήσεις αυτές αποστέλλονται στο cloud όπου και υπόκεινται σε συγκεκριμένη
                            επεξεργασία με σκοπό την ενημέρωση του χρήστη σχετικά με την ποιότητα του ύπνου
                            που έλαβε ο χρήστης το προηγούμενο βράδυ.
                        </div>
                        {/* <div className="section-image">
                            <img src={watch} className="section-image" />
                        </div> */}
                    </div>
                </div>
                <div className='section'>
                    <div className='section_title'>
                        <b>Σχετικά με το ρολόι</b>
                    </div>
                    <div className='text-image'>
                        <div className='section-text'>
                            Για την παρούσα εργασία επιλέχτηκε το Apple Watch Series 7.
                            Το συγκεκριμένο ρολόι διαθέτει υψηλής ακρίβειας αισθητήρων για την
                            μέτρηση των καρδιακών παλμών, και επίσης με την βοήθεια ακτιβολιών
                            μπορεί και μετρά το ποσοστό οξυγόνου στο αίμα.Παράλληλα, ένα άλλο
                            πλεονέκτημα του συγκεκριμένου τύπου ρολογιού είναι το λογισμικό
                            WatchOS 8 που υποστηρίζει. Το ρολόι έχει έναν ταχύτατο διπύρηνο
                            64-bit επεξεργαστή Apple S7 που ενσωματώνει GPU, 32 GB flash memory,
                            Bluetooth 5.0, 1 GB RAM, 802.11 b/g/n 2.4 και 5 GHz WiFi καθώς και
                            δορυφορικό εντοπισμό θέσης (GPS, GLONASS, Galileo, QZSS). Ο ισχυρός
                            επεξεργαστής του ρολογιού σε συνδυασμό με την πρόσβαση στο App Store,
                            δίνει την δυνατότητα στον χρήστη να κατεβάσει εφαρμογές οι οποίες
                            επιχειρούν δύσκολα και απαιτητικά έργα. Στη συνέχεια, αναζητήθηκαν
                            τα κατάλληλα εργαλεία για την ανάπτυξη εφαρμογή σε λειτουργικό WatchOs
                            8. Οι εφαρμογές αυτές αναπτύσσονται σε μια αντικειμενοστρεφή γλώσσα
                            προγραμματισμού γενικής χρήσης Swift. Απαραίτητο πρόγραμμα για την
                            ανάπτυξη τέτοιων εφαρμογών, είναι το Xcode που διατίθεται μόνο σε
                            συσκευές iOS και περιέχει όλα τα απαραίτητα εργαλεία για να μπορέσει
                            να προγραμματίσει κανείς σε περιβάλλον Swift, όπως interpreter,
                            compilers, source editor, assistant editor, fix-it, quick-help
                            καθώς και τους απαραίτητους simulators τόσο συσκευών iPhone αλλά
                            και AppleWatch, iPad κλπ.
                        </div>
                        <div className="section-image">
                            <img src={watch} className="section-image" />
                        </div>
                    </div>
                </div>
                <div className='section'>
                    <div className='section_title'>
                        <b>Σχετικά με τις μετρήσεις</b>
                    </div>
                    <div className='text-image'>

                        <div className='section-text'>
                            Στην διπλανή εικόνα απεικονίζονται οι αισθητήρες του ρολογίου. Πιο συγκεκριμένα,
                            το ρολόι διαθέτει τρείς οπτικούς και ένα ηλεκτρικό αισθητήρα καρδιακών παλμών,
                            αξελερόμετρο και γυρόμετρο νέας γενίας καθώς και φωτοδιόδους για τη
                            μετατροπή της ακτινοβολίας φωτός σε ηλεκτρικό σήμα. Για τους καρδιακούς παλμούς
                            η μέτρηση γίνεται με την βοήθεια του οπτικού αισθητήρα και βασίζεται στο εξής απλό
                            γεγονός: Το αίμα είναι κόκκινο γιατί αντανακλά το κόκκινο φως και απορροφά το πράσινο
                            φως. Το Apple Watch χρησιμοποιεί πράσινα φώτα LED σε συνδυασμό με φωτοδίοδοδους για
                            να ανιχνεύει την ποσότητα αίματος που ρέει στον καρπό ανά πάσα στιγμή. Όταν η καρδιά
                            χτυπά, η ροή του αίματος στον καρπό, επομένως και η απορρόφηση του πράσινου φωτός,
                            είναι μεγαλύτερη. Μεταξύ χτύπων της καρδίας η ροή είναι μικρότερη.
                            Στο Apple Watch Series 6 και Series 7, ο οπτικός αισθητήρας καρδιάς έχει επανασχεδιαστεί
                            για να προσθέσει δυνατότητες μέτρησης οξυγόνου στο αίμα. Ο αισθητήρας οξυγόνου αίματος
                            είναι ενσωματωμένος στο πίσω μέρος του Apple Watch. Χρησιμοποιεί τέσσερις ομάδες κόκκινων,
                            πράσινων και υπέρυθρων φώτων LED και τέσσερις φωτοδίοδοι, συσκευές που μετατρέπουν το φως
                            σε ηλεκτρικό ρεύμα. Τα φώτα λάμπουν στα αιμοφόρα αγγεία στον καρπό και οι φωτοδίοδοι
                            μετρούν πόσο φως αναπηδά πίσω.
                            Η εξαγωγή δεδομένων από το αξελερόμετρο και γυροσκόπιο για την παροχή πληροφοριών
                            σε πραγματικό χρόνο είναι επίσης εφικτή. Υπάρχει δυνατότητα συλλογής δεδομένων κίνησης
                            για να μετρηθεί το επίπεδο δραστηριότητας του χρήστη και να καταγραφούν συγκεκριμένοι
                            τύποι κίνησης, όπως τις κινήσεις των χεριών που γίνονται κατά τη διάρκεια μιας προπόνησης.
                        </div>
                        <div className="section-image">
                            <img src={sensors} className="section-image" />
                        </div>
                    </div>
                </div>
                {/* <div className='section'>
                    <div className='section_title'>
                        <b>Σχετικά με εμάς</b>
                    </div>
                </div> */}
                <ChoicesBoxesLoggedIn />

            </div>
        );
    }
}

export default AboutUs;

