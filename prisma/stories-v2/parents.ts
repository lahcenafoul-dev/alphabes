import type { Lang, StoryParents } from "./types";

// The "For parents" section under each story (SEO phase 3): what the story
// teaches, in a sentence or two for grown-ups, and 4–6 words from the story to
// practise (the page links each to the alphabet page of its first letter).
// The three discussion questions are the story's own `questions`. Written per
// language like the stories: French says vous, Spanish tú (as the rest of the
// Spanish site), Portuguese você.
export const STORY_PARENTS: Record<string, Record<Lang, StoryParents>> = {
  apple: {
    EN: {
      teaches: "Trying again when something is hard, then sharing what you get. The lines that come back (“… no apple!”) let your child tell the story with you.",
      words: ["apple", "red", "tree", "hop", "wind"],
    },
    FR: {
      teaches: "Persévérer quand c'est difficile, puis partager. Les phrases qui reviennent (« … pas de pomme ! ») permettent à votre enfant de raconter l'histoire avec vous.",
      words: ["pomme", "rouge", "arbre", "vent", "hop"],
    },
    ES: {
      teaches: "Volver a intentarlo cuando algo cuesta, y después compartir. Las frases que se repiten («… ¡no hay manzana!») invitan a decir el cuento juntos.",
      words: ["manzana", "roja", "árbol", "salta", "viento"],
    },
    PT: {
      teaches: "Tentar de novo quando algo é difícil e depois dividir. As frases que se repetem (“… e nada de maçã!”) convidam a criança a contar a história com você.",
      words: ["maçã", "vermelha", "árvore", "pula", "vento"],
    },
  },
  dog: {
    EN: {
      teaches: "Looking carefully and not giving up: Rex checks one thing after another until he finds his ball. A nice story for naming colors and everyday objects.",
      words: ["ball", "red", "park", "orange", "balloon", "tree"],
    },
    FR: {
      teaches: "Chercher avec attention sans se décourager : Filou regarde chaque objet jusqu'à retrouver sa balle. Une bonne occasion de nommer les couleurs et les objets du quotidien.",
      words: ["balle", "rouge", "parc", "orange", "ballon", "arbre"],
    },
    ES: {
      teaches: "Buscar con atención y no rendirse: Canelo mira cada cosa hasta encontrar su pelota. Sirve para nombrar colores y objetos de todos los días.",
      words: ["pelota", "roja", "parque", "naranja", "globo"],
    },
    PT: {
      teaches: "Procurar com atenção e não desistir: o Totó olha cada coisa até achar a bola. Ótima para nomear cores e objetos do dia a dia.",
      words: ["bola", "vermelha", "parque", "laranja", "balão"],
    },
  },
  fish: {
    EN: {
      teaches: "Making a friend: Finn keeps asking kindly, and someone finally says yes. The question that repeats (“Play with me?”) is easy for children to join in.",
      words: ["fish", "friend", "snail", "shell", "crab", "play"],
    },
    FR: {
      teaches: "Se faire un ami : Pilou demande gentiment, encore et encore, et quelqu'un finit par dire oui. La question qui revient (« Tu joues avec moi ? ») est facile à dire avec lui.",
      words: ["poisson", "ami", "escargot", "coquillage", "crabe", "jouer"],
    },
    ES: {
      teaches: "Hacer un amigo: Burbujas pregunta con cariño una y otra vez, hasta que alguien dice que sí. La pregunta que se repite («¿Juegas conmigo?») es fácil de decir juntos.",
      words: ["pececito", "amigo", "caracol", "concha", "jugar"],
    },
    PT: {
      teaches: "Fazer um amigo: o Bolinha pergunta com carinho, de novo e de novo, até alguém dizer sim. A pergunta que se repete (“Brinca comigo?”) é fácil de falar junto.",
      words: ["peixinho", "amigo", "caracol", "concha", "brincar"],
    },
  },
  puddles: {
    EN: {
      teaches: "Counting from one to five and comparing sizes: too small, then big! Count the puddles together on each page.",
      words: ["rain", "puddle", "five", "big", "small", "splash"],
    },
    FR: {
      teaches: "Compter de un à cinq et comparer les tailles : trop petite, puis grosse ! Comptez les flaques ensemble à chaque page.",
      words: ["flaque", "pleut", "cinq", "grosse", "petite", "bain"],
    },
    ES: {
      teaches: "Contar del uno al cinco y comparar tamaños: muy chiquito, ¡y luego grande! Cuenten juntos los charcos en cada página.",
      words: ["charco", "llueve", "cinco", "grande", "baño"],
    },
    PT: {
      teaches: "Contar de um a cinco e comparar tamanhos: pequena demais, e depois grande! Contem juntos as poças em cada página.",
      words: ["poça", "chove", "cinco", "grande", "banho"],
    },
  },
  paint: {
    EN: {
      teaches: "Colors and what they can paint: a red apple, a blue sky, a yellow sun, green grass. And that a little accident can turn into something lovely.",
      words: ["red", "blue", "yellow", "green", "sun", "sky"],
    },
    FR: {
      teaches: "Les couleurs et ce qu'elles dessinent : une pomme rouge, un ciel bleu, un soleil jaune, de l'herbe verte. Et une petite maladresse peut devenir une belle idée.",
      words: ["rouge", "bleu", "jaune", "vert", "soleil", "ciel"],
    },
    ES: {
      teaches: "Los colores y lo que se puede pintar con ellos: una manzana roja, un cielo azul, un sol amarillo, hierba verde. Y que un pequeño accidente puede terminar en algo bonito.",
      words: ["rojo", "azul", "amarillo", "verde", "sol", "cielo"],
    },
    PT: {
      teaches: "As cores e o que dá para pintar com elas: uma maçã vermelha, um céu azul, um sol amarelo, grama verde. E que um pequeno acidente pode virar algo bonito.",
      words: ["vermelho", "azul", "amarelo", "verde", "sol", "céu"],
    },
  },
  taste: {
    EN: {
      teaches: "Trying new foods, one little bite at a time, and naming the colors of vegetables and fruit. Handy for picky eaters at the table.",
      words: ["carrot", "corn", "plum", "bite", "green", "yum"],
    },
    FR: {
      teaches: "Goûter de nouveaux aliments, une petite bouchée à la fois, et nommer les couleurs des fruits et légumes. Pratique quand on fait la fine bouche à table.",
      words: ["carotte", "brocoli", "maïs", "prune", "miam"],
    },
    ES: {
      teaches: "Probar comidas nuevas, un bocadito a la vez, y nombrar los colores de frutas y verduras. Ayuda mucho con los niños que no quieren probar nada.",
      words: ["zanahoria", "brócoli", "maíz", "ciruela", "verde"],
    },
    PT: {
      teaches: "Experimentar comidas novas, uma mordidinha de cada vez, e nomear as cores das frutas e verduras. Ajuda muito com crianças que não querem provar nada.",
      words: ["cenoura", "brócolis", "milho", "ameixa", "verde"],
    },
  },
  home: {
    EN: {
      teaches: "Animal homes (a nest, a hive, a pond, a burrow) and a question-and-answer pattern children quickly say along: “Is this my home? No…”",
      words: ["home", "nest", "bee", "pond", "boot", "mouse"],
    },
    FR: {
      teaches: "Les maisons des animaux (un nid, une ruche, une mare, un terrier) et une question-réponse que l'enfant retient vite : « C'est ma maison ? Non… »",
      words: ["maison", "nid", "ruche", "mare", "botte", "souris"],
    },
    ES: {
      teaches: "Las casas de los animales (un nido, un panal, un estanque, una madriguera) y una pregunta con respuesta que los niños aprenden enseguida: «¿Es mi casa? No…»",
      words: ["casa", "nido", "panal", "abeja", "bota"],
    },
    PT: {
      teaches: "As casas dos bichos (um ninho, uma colmeia, uma lagoa, uma toca) e uma pergunta com resposta que a criança aprende rapidinho: “É a minha casa? Não…”",
      words: ["casa", "ninho", "abelha", "toca", "bota"],
    },
  },
  hill: {
    EN: {
      teaches: "Keeping going after a fall: slow and steady gets you to the top. Up, slide and roll are fun words to act out.",
      words: ["hill", "up", "top", "step", "slide", "roll"],
    },
    FR: {
      teaches: "Continuer après une chute : tout doucement, un pas après l'autre, on arrive en haut. « Monte », « glisse » et « roule » se miment très bien.",
      words: ["colline", "tortue", "monte", "pas", "glisse", "roule"],
    },
    ES: {
      teaches: "Seguir después de caerse: despacito, paso a paso, se llega arriba. «Sube», «se resbala» y «rueda» son fáciles de actuar.",
      words: ["colina", "tortuga", "sube", "paso", "rueda"],
    },
    PT: {
      teaches: "Continuar depois de cair: devagar, um passo de cada vez, a gente chega lá em cima. “Sobe”, “escorrega” e “rola” são ótimas para imitar.",
      words: ["morro", "tartaruga", "sobe", "passo", "rola"],
    },
  },
  duck: {
    EN: {
      teaches: "Feeling shy and taking small steps: Daisy tries a little more each day, and a friend helps her be brave.",
      words: ["duck", "pond", "swim", "shy", "frog", "splash"],
    },
    FR: {
      teaches: "La timidité et les petits pas : Coline essaie un peu plus chaque jour, et un ami l'aide à se lancer.",
      words: ["cane", "mare", "nager", "timide", "grenouille", "plouf"],
    },
    ES: {
      teaches: "La timidez y los pasos pequeños: Lupita lo intenta un poco más cada día, y un amigo la ayuda a animarse.",
      words: ["patita", "estanque", "nadar", "tímida", "sapito"],
    },
    PT: {
      teaches: "A timidez e os pequenos passos: a Lili tenta um pouco mais a cada dia, e um amigo ajuda a criar coragem.",
      words: ["patinha", "lagoa", "nadar", "tímida", "sapinho"],
    },
  },
  lion: {
    EN: {
      teaches: "Handling a big feeling with a deep breath, and asking politely instead of roaring. Try saying “tweet, tweet” loudly, then softly.",
      words: ["lion", "nap", "bird", "loud", "soft", "please"],
    },
    FR: {
      teaches: "Gérer une grosse émotion en respirant, et demander poliment au lieu de rugir. Dites « cui, cui » très fort, puis tout doucement.",
      words: ["lion", "sieste", "oiseau", "fort", "doucement"],
    },
    ES: {
      teaches: "Calmar una emoción fuerte respirando hondo, y pedir por favor en vez de rugir. Prueben a decir «pío, pío» fuerte y luego bajito.",
      words: ["leoncito", "siesta", "pajarito", "fuerte", "bajito"],
    },
    PT: {
      teaches: "Lidar com uma emoção forte respirando fundo e pedir com educação em vez de rugir. Experimente falar “piu, piu” alto e depois baixinho.",
      words: ["leão", "soneca", "passarinho", "alto", "baixinho"],
    },
  },
  bear: {
    EN: {
      teaches: "Being brave even when you are scared, and how a friend makes the dark less frightening. A good story for children who don't like the dark.",
      words: ["bear", "dark", "brave", "help", "tree", "friend"],
    },
    FR: {
      teaches: "Avoir du courage même quand on a peur, et découvrir qu'avec un ami, le noir fait moins peur. Une bonne histoire pour les enfants qui n'aiment pas le noir.",
      words: ["ourson", "noir", "forêt", "courage", "lanterne", "ami"],
    },
    ES: {
      teaches: "Ser valiente aunque se tenga miedo, y descubrir que con una amiga la oscuridad asusta menos. Un buen cuento para los niños a los que no les gusta la oscuridad.",
      words: ["osito", "bosque", "noche", "valor", "árbol"],
    },
    PT: {
      teaches: "Ter coragem mesmo com medo e descobrir que, com uma amiga, o escuro assusta menos. Uma boa história para crianças que não gostam do escuro.",
      words: ["ursinho", "floresta", "escuro", "coragem", "árvore"],
    },
  },
  bedtime: {
    EN: {
      teaches: "A calm bedtime routine: a drink, a story, a kiss, a song, then sleep. Children love spotting the “just one more” they ask for too.",
      words: ["bed", "cup", "moon", "kiss", "song", "sleep"],
    },
    FR: {
      teaches: "Un rituel du coucher tout calme : un verre d'eau, une histoire, un bisou, une chanson, puis dodo. Les enfants s'amusent à reconnaître leurs propres « encore un ! ».",
      words: ["lit", "verre", "lune", "bisou", "chanson", "dormir"],
    },
    ES: {
      teaches: "Una rutina tranquila para dormir: agua, cuento, beso, canción y a dormir. A los niños les encanta reconocer sus propios «¡uno más!».",
      words: ["camita", "vasito", "luna", "beso", "canción"],
    },
    PT: {
      teaches: "Uma rotina calma na hora de dormir: água, história, beijo, música e sono. As crianças adoram reconhecer os próprios “só mais um!”.",
      words: ["caminha", "copinho", "lua", "beijo", "música"],
    },
  },
  angry: {
    EN: {
      teaches: "What to do with anger: notice the big feeling, then “smell the flower, blow out the candle” to breathe slowly. Try it together.",
      words: ["block", "tower", "tall", "flower", "candle", "strong"],
    },
    FR: {
      teaches: "Que faire de la colère : la reconnaître, puis « sentir la fleur, souffler la bougie » pour respirer doucement. Essayez ensemble.",
      words: ["tour", "cube", "haute", "fleur", "bougie"],
    },
    ES: {
      teaches: "Qué hacer con el enojo: darse cuenta de lo que se siente y luego «oler la flor, soplar la vela» para respirar despacito. Pruébenlo juntos.",
      words: ["torre", "bloque", "alta", "flor", "vela"],
    },
    PT: {
      teaches: "O que fazer com a raiva: perceber o que está sentindo e depois “cheirar a flor, soprar a vela” para respirar devagar. Experimentem juntos.",
      words: ["torre", "bloco", "alta", "flor", "vela"],
    },
  },
  helping: {
    EN: {
      teaches: "Helping at home, and that everyone has a job they are good at. Counting one plate, one cup and one spoon per friend is a little math moment.",
      words: ["help", "egg", "table", "plate", "cup", "spoon"],
    },
    FR: {
      teaches: "Aider à la maison, et voir que chacun a une tâche qui lui va bien. Compter une assiette, un verre et une cuillère par ami, c'est déjà des maths.",
      words: ["aider", "carotte", "table", "assiette", "verre"],
    },
    ES: {
      teaches: "Ayudar en casa y descubrir que cada uno tiene una tarea que le sale bien. Contar un plato, un vaso y una cuchara por amigo ya es un ratito de matemáticas.",
      words: ["huevo", "mesa", "plato", "vaso", "cuchara"],
    },
    PT: {
      teaches: "Ajudar em casa e descobrir que cada um tem uma tarefa que faz bem. Contar um prato, um copo e uma colher para cada amigo já é um pouquinho de matemática.",
      words: ["ovo", "mesa", "prato", "copo", "colher"],
    },
  },
  snow: {
    EN: {
      teaches: "The four seasons (spring, summer, autumn and winter) and being patient while you wait for something you really want.",
      words: ["snow", "spring", "summer", "autumn", "hat", "milk"],
    },
    FR: {
      teaches: "Les quatre saisons (printemps, été, automne et hiver) et la patience quand on attend quelque chose très fort.",
      words: ["neige", "printemps", "été", "automne", "bonnet", "lait"],
    },
    ES: {
      teaches: "Las cuatro estaciones (primavera, verano, otoño e invierno) y la paciencia cuando uno espera algo con muchas ganas.",
      words: ["nieve", "primavera", "verano", "otoño", "gorro"],
    },
    PT: {
      teaches: "As quatro estações (primavera, verão, outono e inverno) e a paciência de esperar por algo que a gente quer muito.",
      words: ["neve", "primavera", "verão", "outono", "gorro"],
    },
  },
  sharing: {
    EN: {
      teaches: "Taking turns: when both pull, nobody plays; when they share, the fun doubles. “Your turn, my turn” is a handy phrase for real life.",
      words: ["swing", "park", "turn", "push", "red", "fun"],
    },
    FR: {
      teaches: "Attendre son tour : quand chacun tire, personne ne joue ; quand on partage, on s'amuse deux fois plus. « À toi, à moi » est une phrase bien utile au quotidien.",
      words: ["balançoire", "parc", "rouge", "pousser", "idée"],
    },
    ES: {
      teaches: "Esperar el turno: si los dos quieren el columpio al mismo tiempo, nadie juega; si comparten, se divierten el doble. «Te toca a ti, me toca a mí» es una frase muy útil en el día a día.",
      words: ["columpio", "parque", "rojo", "empujo", "idea"],
    },
    PT: {
      teaches: "Esperar a vez: quando os dois puxam, ninguém brinca; quando dividem, a diversão dobra. “Sua vez, minha vez” é uma frase muito útil no dia a dia.",
      words: ["balanço", "parque", "vez", "vermelho", "ideia"],
    },
  },
  cat: {
    EN: {
      teaches: "Curiosity, waiting, and putting a mistake right: Milo opens the box, gets tangled up, then helps tidy up. Look for the place words: around, under, over.",
      words: ["box", "yarn", "hat", "wait", "under", "over"],
    },
    FR: {
      teaches: "La curiosité, l'attente, et réparer une bêtise : Moustache ouvre la boîte, s'emmêle, puis aide à ranger. Repérez les mots qui disent où : autour, sous, sur.",
      words: ["boîte", "laine", "bonnet", "chaton", "sous", "sur"],
    },
    ES: {
      teaches: "La curiosidad, la espera y arreglar un error: Mía abre la caja, se enreda y luego ayuda a ordenar. Busquen las palabras que dicen dónde: alrededor, debajo, encima.",
      words: ["caja", "lana", "gorro", "gatita", "mesa"],
    },
    PT: {
      teaches: "A curiosidade, a espera e consertar um erro: a Mimi abre a caixa, se enrola toda e depois ajuda a arrumar. Procurem as palavras que dizem onde: em volta, embaixo, em cima.",
      words: ["caixa", "lã", "gorro", "gatinha", "mesa"],
    },
  },
  owl: {
    EN: {
      teaches: "Solving a problem by asking good questions, and helping someone who is lost. Describing places (near the pond, past the rock) builds vocabulary.",
      words: ["owl", "mouse", "boot", "pond", "rock", "sunflower"],
    },
    FR: {
      teaches: "Résoudre un problème en posant les bonnes questions, et aider quelqu'un qui s'est perdu. Décrire un lieu (près de la mare, après le rocher) enrichit le vocabulaire.",
      words: ["hibou", "souris", "botte", "mare", "rocher", "tournesol"],
    },
    ES: {
      teaches: "Resolver un problema con buenas preguntas y ayudar a alguien que está perdido. Describir lugares (cerca del estanque, después de la roca) da mucho vocabulario.",
      words: ["búho", "bota", "roca", "estanque", "girasol"],
    },
    PT: {
      teaches: "Resolver um problema fazendo boas perguntas e ajudar alguém que se perdeu. Descrever lugares (perto da lagoa, depois da pedra) amplia o vocabulário.",
      words: ["coruja", "ratinha", "bota", "pedra", "lagoa", "girassóis"],
    },
  },
  letters: {
    EN: {
      teaches: "The sound at the start of a word: A for airplane, B for ball, E for elephant, L for lion, T for tomato, U for ukulele. Play the same game with things at home.",
      words: ["airplane", "ball", "elephant", "lion", "tomato", "ukulele"],
    },
    FR: {
      teaches: "Le son du début des mots : A comme avion, B comme ballon, É comme éléphant, L comme lion, T comme tomate, U comme ukulélé. Jouez au même jeu avec les objets de la maison.",
      words: ["avion", "ballon", "éléphant", "lion", "tomate", "ukulélé"],
    },
    ES: {
      teaches: "El sonido del comienzo de las palabras: A de avión, B de balón, E de elefante, L de león, T de tomate, U de ukelele. Jueguen a lo mismo con cosas de la casa.",
      words: ["avión", "balón", "elefante", "león", "tomate", "ukelele"],
    },
    PT: {
      teaches: "O som do começo das palavras: A de avião, B de bola, E de elefante, L de leão, T de tomate, U de ukulele. Brinquem do mesmo jeito com coisas de casa.",
      words: ["avião", "bola", "elefante", "leão", "tomate", "ukulele"],
    },
  },
  cherries: {
    EN: {
      teaches: "Counting to ten, and counting again when some are gone. Count real cherries, grapes or blocks together after reading.",
      words: ["ten", "cherries", "basket", "picnic", "count"],
    },
    FR: {
      teaches: "Compter jusqu'à dix, et recompter quand il en manque. Après la lecture, comptez ensemble de vraies cerises, des raisins ou des cubes.",
      words: ["dix", "cerise", "panier", "pique-nique", "compte"],
    },
    ES: {
      teaches: "Contar hasta diez, y volver a contar cuando faltan algunas. Después de leer, cuenten juntos cerezas, uvas o bloques de verdad.",
      words: ["diez", "cereza", "canasta", "pícnic", "cuenta"],
    },
    PT: {
      teaches: "Contar até dez e contar de novo quando falta alguma. Depois da leitura, contem juntos cerejas, uvas ou blocos de verdade.",
      words: ["dez", "cereja", "cesta", "piquenique", "conta"],
    },
  },
  balloon: {
    EN: {
      teaches: "It's okay to be sad, and sometimes the best help is simply staying close. Talk about what helps your child when they feel sad.",
      words: ["balloon", "red", "wind", "sad", "sky", "cloud"],
    },
    FR: {
      teaches: "On a le droit d'être triste, et parfois la meilleure aide, c'est simplement de rester à côté. Parlez de ce qui aide votre enfant quand il a du chagrin.",
      words: ["ballon", "rouge", "vent", "triste", "ciel", "nuage"],
    },
    ES: {
      teaches: "Está bien estar triste, y a veces la mejor ayuda es solo quedarse cerca. Hablen de lo que los ayuda cuando están tristes.",
      words: ["globo", "rojo", "viento", "triste", "cielo", "nube"],
    },
    PT: {
      teaches: "Tudo bem ficar triste, e às vezes a melhor ajuda é só ficar perto. Conversem sobre o que ajuda a criança quando ela está triste.",
      words: ["balão", "vermelho", "vento", "triste", "céu", "nuvens"],
    },
  },
  bat: {
    EN: {
      teaches: "Friends can be different: day animals and a night animal find a time that works for everyone. Talk about day, night and sunset.",
      words: ["bat", "barn", "night", "sunset", "star", "play"],
    },
    FR: {
      teaches: "On peut être amis même si on est différents : les animaux du jour et ceux de la nuit trouvent un moment pour tous. Parlez du jour, de la nuit et du coucher du soleil.",
      words: ["grange", "nuit", "soleil", "étoile", "jouer"],
    },
    ES: {
      teaches: "Se puede ser amigos aunque seamos distintos: los animales del día y los de la noche encuentran un momento para todos. Hablen del día, la noche y el atardecer.",
      words: ["murciélago", "granero", "noche", "atardecer", "estrella"],
    },
    PT: {
      teaches: "Dá para ser amigo mesmo sendo diferente: os bichos do dia e os da noite acham uma hora boa para todos. Conversem sobre o dia, a noite e o pôr do sol.",
      words: ["morcego", "celeiro", "noite", "sol", "estrela"],
    },
  },
  bike: {
    EN: {
      teaches: "Not giving up when you learn something new: fall, try again, go slowly. Tell your child about something you learned slowly too.",
      words: ["bike", "helmet", "blue", "park", "ride", "slow"],
    },
    FR: {
      teaches: "Ne pas abandonner quand on apprend quelque chose : tomber, réessayer, aller doucement. Racontez à votre enfant une chose que vous avez apprise petit à petit.",
      words: ["vélo", "casque", "bleu", "parc", "pédale"],
    },
    ES: {
      teaches: "No rendirse al aprender algo nuevo: caerse, intentarlo otra vez, ir despacio. Cuéntales algo que tú también aprendiste poco a poco.",
      words: ["bici", "casco", "azul", "parque", "pedalea"],
    },
    PT: {
      teaches: "Não desistir ao aprender algo novo: cair, tentar de novo, ir devagar. Conte para a criança algo que você também aprendeu aos poucos.",
      words: ["bicicleta", "capacete", "azul", "parque", "pedala"],
    },
  },
  school: {
    EN: {
      teaches: "First-day nerves (“butterflies in your tummy”), a small comfort from home, and making a new friend. A good story to read before school starts.",
      words: ["school", "pebble", "paint", "sun", "yellow", "snack"],
    },
    FR: {
      teaches: "Le trac du premier jour (« des papillons dans le ventre »), un petit objet de la maison pour se rassurer, et une nouvelle amie. Une bonne histoire à lire avant la rentrée.",
      words: ["école", "caillou", "papillon", "peindre", "soleil"],
    },
    ES: {
      teaches: "Los nervios del primer día («mariposas en la panza»), algo pequeñito de casa que da confianza y una nueva amiga. Un buen cuento para leer antes de empezar la escuela.",
      words: ["escuela", "piedrita", "mariposa", "pintar", "sol"],
    },
    PT: {
      teaches: "O nervosismo do primeiro dia (o “frio na barriga”), um objetinho de casa que acalma e uma nova amiga. Uma boa história para ler antes de começar a escola.",
      words: ["escola", "pedrinha", "pintar", "sol", "lanche"],
    },
  },
};
