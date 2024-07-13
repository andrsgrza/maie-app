export default class Item {

    constructor(question, answer) {
        this.question = question;
        this.answer = answer;
        this.editMode = false; // Default to false if editMode is not provided
    }
}
