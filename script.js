const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const prevBtn = document.querySelector(".lb-prev");
const nextBtn = document.querySelector(".lb-next");

let currentImages = [];   // 今開いている作品の画像リスト
let currentIndex = 0;     // 何枚目を表示しているか

// 指定した番号の画像を表示する
function showImage(index) {
    // 範囲外なら何もしない(ループしない)
    if (index < 0 || index >= currentImages.length) return;

    currentIndex = index;
    const img = currentImages[currentIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;

    // 端まで来たら、その方向のボタンを隠す
    prevBtn.style.visibility = currentIndex === 0 ? "hidden" : "visible";
    nextBtn.style.visibility =
        currentIndex === currentImages.length - 1 ? "hidden" : "visible";
}

function closeLightbox() {
    lightbox.classList.remove("open");
}

// 作品画像をクリックしたら拡大表示
document.querySelectorAll(".work-images").forEach((group) => {
    const images = Array.from(group.querySelectorAll("img"));

    images.forEach((img, i) => {
        img.addEventListener("click", () => {
            currentImages = images;   // クリックした作品の画像だけを切り替え対象にする
            showImage(i);
            lightbox.classList.add("open");
        });
    });
});

// 矢印ボタン(クリックが背景に伝わって閉じるのを防ぐため stopPropagation を使う)
prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showImage(currentIndex - 1);
});

nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showImage(currentIndex + 1);
});

// 背景をクリックしたら閉じる
lightbox.addEventListener("click", closeLightbox);

// キーボード操作(Esc: 閉じる、←→: 切り替え)
document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showImage(currentIndex - 1);
    if (e.key === "ArrowRight") showImage(currentIndex + 1);
});

const navLinks = document.querySelectorAll("nav a");
const sections = document.querySelectorAll("h2[id]");

function updateActiveNav() {
    let currentId = "";

    // 画面の上から120px以内に来た見出しのうち、一番下のものを今いる場所とする
    sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= 120) {
            currentId = section.id;
        }
    });

    // ページの一番下まで来たら、最後のセクションを強調する
    // (Contactは短くて、上の条件に届かないことがあるため)
    const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
    if (atBottom) {
        currentId = sections[sections.length - 1].id;
    }

    // 該当するリンクにだけ active を付ける
    navLinks.forEach((link) => {
        link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + currentId
        );
    });
}

window.addEventListener("scroll", updateActiveNav);
updateActiveNav();   // 読み込み直後にも1回実行する
