
import urllib.parse

# --- KONFIGURASI ---

# URL dasar undangan Anda (host tempat index.html di-deploy, mis. GitHub Pages / Netlify / dst).
# WAJIB diakhiri "/" supaya link "<url>#nama" tetap valid.
BASE_INVITATION_URL = "https://example.com/bagus-ayu/"

# Nama file input dan output
GUESTS_FILE = "tamu.txt"
OUTPUT_FILE = "hasil.txt"

# Nama mempelai untuk template pesan
NAMA_PRIA  = "Raden Bagus Pratama, S.T."
NAMA_WANITA = "Ayu Permata Sari, S.E."
SIGNATURE  = "Ayu & Bagus"

# Template pesan WhatsApp
# Anda bisa mengubah isi pesan di bawah ini jika perlu
MESSAGE_TEMPLATE = f"""Kepada Yth.
Bapak/Ibu/Saudara/i

_Assalamualaikum Warahmatullahi Wabarakaatuh_
Dengan memohon rahmat dan ridho Allah SWT, perkenankan kami mengundang Bapak/Ibu/Saudara/i *{{guest_name}}* untuk menghadiri acara pernikahan kami :

🧕🏻 *{NAMA_WANITA}*

dengan

🤵🏻 *{NAMA_PRIA}*

*Untuk informasi detail mengenai acara, silahkan kunjungi link dibawah ini :*

*{{invitation_link}}*

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.
Atas kehadiran dan doa restunya kami ucapkan terima kasih.
_Wassalamualaikum Warahmatullahi Wabarakaatuh_

Hormat kami,
*{SIGNATURE}*"""

# --- SCRIPT UTAMA (JANGAN DIUBAH) ---

def generate_links():
    """
    Membaca nama tamu, membuat link WhatsApp, dan menyimpannya ke file output.
    """
    try:
        with open(GUESTS_FILE, 'r', encoding='utf-8') as f_in, \
             open(OUTPUT_FILE, 'w', encoding='utf-8') as f_out:
            
            print(f"Membaca nama dari '{GUESTS_FILE}'...")
            f_out.write("Link WhatsApp yang sudah jadi:\n")
            f_out.write("===============================\n\n")

            count = 0
            for name in f_in:
                guest_name = name.strip()
                if not guest_name:
                    continue

                # 1. Buat link undangan unik dengan hash
                encoded_guest_name = urllib.parse.quote(guest_name)
                invitation_link = f"{BASE_INVITATION_URL}#{encoded_guest_name}"

                # 2. Buat pesan WhatsApp lengkap
                message_text = MESSAGE_TEMPLATE.format(
                    guest_name=guest_name,
                    invitation_link=invitation_link
                )

                # 3. Encode seluruh pesan untuk URL WhatsApp
                encoded_message = urllib.parse.quote(message_text)

                # 4. Buat link WhatsApp final
                whatsapp_link = f"https://wa.me/?text={encoded_message}"

                # 5. Tulis hasilnya ke file output
                f_out.write(f"Untuk: {guest_name}\n")
                f_out.write(f"{whatsapp_link}\n\n")
                count += 1
        
        print(f"\nBerhasil! {count} link telah dibuat dan disimpan di file '{OUTPUT_FILE}'")

    except FileNotFoundError:
        print(f"\nError: File '{GUESTS_FILE}' tidak ditemukan. Mohon buat file tersebut terlebih dahulu.")
    except Exception as e:
        print(f"\nTerjadi error: {e}")

if __name__ == "__main__":
    generate_links()
