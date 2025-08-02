

# 📚 StudyMe

StudyMe is a simple and modern web app to practice single or multiple choice questions, perfect for personal exam prep or review. Learn by playing! 🎓✨

> **Note:** Multilanguage support (Spanish, English, French) will be added soon. For now, the app is only available in English.

## ✨ Main Features
- 📄 **Load questions** from a custom `.txt` file.
- 💻 **Modern and responsive interface** using Bootstrap 5 and Animate.css.
- ⏰ **Global timer** for the exam, with automatic summary when time is up.
- 🧭 **Easy navigation** between questions, with previous, next, and show answer buttons.
- 📊 **Visual progress bar** and results summary at the end.
- 🚀 **No backend dependencies**: just HTML, CSS, and pure JS. Use it instantly online!

## 📝 Question file format
Each line must have:

```
Question|a) option1|b) option2|c) option3|d) option4|correct_letter
```
- 📌 Example:
```
What is the capital of France?|a) Madrid|b) London|c) Paris|d) Berlin|c
How much is 2 + 2?|a) 3|b) 4|c) 5|d) 22|b
```
- ✅ For multiple correct answers, separate with comma: `a,c`

## 🚦 How to use
1. 🌐 Go to: [https://studyme-seven.vercel.app/](https://studyme-seven.vercel.app/)
2. 📂 Upload your `.txt` questions file.
3. ⏳ Set exam duration and passing score.
4. 🏁 Start studying!

## 🗂️ Project structure
- `index.html` — Main interface
- `main.js` — App logic
- `languages.js` — (Future) Translations
- `style.css` — Custom styles

## 👨‍💻 Credits
- Made with ❤️ for personal study.
- Powered by Bootstrap 5 and Animate.css.

---

🙌 Contributions and suggestions are welcome!
