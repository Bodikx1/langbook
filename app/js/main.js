$(document).ready(function(){
    localStorage.setItem('sentences', JSON.stringify({
        "sentences": [
            {
                "language_1": "Bonjour je m'appelle Bogdan",
                "language_2": "Hello my name is Bogdan",
                "tags": ["tag1", "tag2"]
            },
            {
                "language_1": "Bonjour je m'appelle Bogdan 2",
                "language_2": "Hello my name is Bogdan 2",
                "tags": ["tag1", "tag3"]
            }
        ]
    }));
    SentenceGenerator.init();
    //SentenceManager.init();
});