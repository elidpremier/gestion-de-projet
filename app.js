document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements with safety checks
    const moduleList = document.getElementById('moduleList');
    const moduleItems = moduleList ? moduleList.querySelectorAll('.module-item') : [];
    const contentSections = document.querySelectorAll('.content-section');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const mindmapNodes = document.querySelectorAll('.mindmap-node');
    const mindmapCenter = document.getElementById('mindmapCenter');
    const flashcard = document.getElementById('flashcard1');
    const quizScoreDisplay = document.getElementById('quizScore');
    const personalNotes = document.getElementById('personalNotes');
    const globalProgress = document.getElementById('globalProgress');
    const progressStat = document.getElementById('progressStat');
    const notesBtn = document.getElementById('notesBtn');
    const exportBtn = document.getElementById('exportBtn');
    const courseSearch = document.getElementById('courseSearch');
    const quizContainer = document.getElementById('quizContainer');
    const quizPagination = document.getElementById('quizPagination');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const submitQuizBtn = document.getElementById('submitQuiz');

    // Initialize state
    let score = 0;
    let answeredQuestions = 0;
    let darkMode = localStorage.getItem('darkMode') === 'true';
    let savedNotes = localStorage.getItem('courseNotes') || '';
    let currentPage = 1;
    const questionsPerPage = 5;
    const totalQuestions = 50;
    const totalPages = Math.ceil(totalQuestions / questionsPerPage);

    // Quiz data - 50 questions based on course content
    const quizData = [
        { question: "1. Selon le PMI, qu'est-ce qu'un projet ?", options: ["Une opération répétitive visant à maintenir la production","Une entreprise temporaire visant à créer un produit et/ou un service unique","Un processus continu d'amélioration des services","Une structure permanente de l'organisation"], correctIndex: 1, hint: "Indice : Revoir le Module 1 sur les définitions fondamentales de la gestion de projet." },
        { question: "2. Quelle est la formule de la criticité d'un risque ?", options: ["Gravité + Fréquence","Gravité / Fréquence","Gravité × Fréquence","Fréquence - Gravité"], correctIndex: 2, hint: "Indice : La criticité combine deux dimensions du risque." },
        { question: "3. Quel outil permet de visualiser l'enchaînement des tâches et le chemin critique ?", options: ["Le diagramme de Gantt","La méthode PERT","La matrice SWOT","Le cadre logique"], correctIndex: 1, hint: "Indice : Cet outil utilise un réseau de tâches avec des durées optimistes, pessimistes et probables." },
        { question: "4. Dans le cadre logique, quel niveau correspond aux 'biens, services ou changements produits par le projet' ?", options: ["Objectif Global","Objectifs Spécifiques","Résultats","Activités"], correctIndex: 2, hint: "Indice : Ce niveau est situé entre les objectifs spécifiques et les activités." },
        { question: "5. Quelle est la première étape de la gestion des risques ?", options: ["Identifier les risques","Évaluer les risques","Prévenir les risques","Suivre les risques"], correctIndex: 0, hint: "Indice : Avant de pouvoir évaluer ou traiter les risques, il faut d'abord les connaître." },
        { question: "6. Quelle phase du cycle de vie d'un projet inclut la définition des objectifs et l'étude de faisabilité ?", options: ["Conception","Planification","Réalisation","Clôture"], correctIndex: 0, hint: "Indice : C'est la phase initiale qui détermine si le projet est viable." },
        { question: "7. Quel document présente les objectifs d'un projet, ses indicateurs, ses hypothèses et ses intervenants ?", options: ["Le plan de communication","Le cadre logique","Le diagramme de Gantt","Le plan de mitigation"], correctIndex: 1, hint: "Indice : C'est un outil de structuration et de pilotage du projet." },
        { question: "8. Quelle méthode de planification utilise des barres horizontales pour représenter les tâches dans le temps ?", options: ["La méthode PERT","Le diagramme de Gantt","La méthode des potentiels","La WBS"], correctIndex: 1, hint: "Indice : C'est un outil visuel très populaire pour la planification de projet." },
        { question: "9. Quel type d'organisation implique un double reporting (fonctionnel et projet) ?", options: ["Hiérarchique","Divisionnaire","Matricielle","Fonctionnelle"], correctIndex: 2, hint: "Indice : Cette structure combine les avantages de l'organisation fonctionnelle et par projet." },
        { question: "10. Quelle est la dernière phase du cycle de vie d'un projet ?", options: ["Conception","Planification","Réalisation","Clôture"], correctIndex: 3, hint: "Indice : Cette phase inclut l'évaluation finale et la capitalisation des connaissances." },
        { question: "11. Quel document conceptuel est utilisé pour les projets à but lucratif ?", options: ["Le cadre logique","Le plan d'affaires","Le document de projet","Le plan de communication"], correctIndex: 1, hint: "Indice : Ce document inclut des sous-dossiers juridique, étude de marché, technique et financier." },
        { question: "12. Quelle fonction ne doit jamais être cumulée avec l'enregistrement dans un processus ?", options: ["L'autorisation","La détention","Le contrôle","Toutes les réponses ci-dessus"], correctIndex: 3, hint: "Indice : Selon le principe des quatre fonctions incompatibles, aucune de ces fonctions ne doit être cumulée." },
        { question: "13. Quel outil permet d'identifier le chemin critique d'un projet ?", options: ["Le diagramme de Gantt","La méthode PERT","La matrice des risques","Le cadre logique"], correctIndex: 1, hint: "Indice : Cet outil utilise un réseau de tâches avec des durées optimistes, pessimistes et probables." },
        { question: "14. Quelle phase du cycle de vie inclut l'exécution des tâches et la gestion des imprévus ?", options: ["Conception","Planification","Réalisation","Clôture"], correctIndex: 2, hint: "Indice : C'est la phase où le travail concret est réalisé." },
        { question: "15. Quel niveau du cadre logique correspond à l'impact à long terme sur le développement ?", options: ["Objectif Global","Objectifs Spécifiques","Résultats","Activités"], correctIndex: 0, hint: "Indice : C'est le niveau le plus élevé du cadre logique." },
        { question: "16. Quelle est la première étape de la planification stratégique d'un projet ?", options: ["Sélection des axes réalistes","Brainstorming des axes stratégiques","Planification des axes stratégiques","Définition du type d'organisation"], correctIndex: 1, hint: "Indice : Cette étape implique de générer des idées en équipe." },
        { question: "17. Quel type de risque concerne la disponibilité des budgets au bon moment ?", options: ["Faisabilité technique","Faisabilité calendaire","Faisabilité financière","Risque opérationnel"], correctIndex: 2, hint: "Indice : Ce risque est lié à la gestion de l'argent du projet." },
        { question: "18. Quelle matrice permet de prioriser les risques en fonction de leur gravité et de leur fréquence ?", options: ["Matrice SWOT","Matrice de planification","Matrice des risques","Matrice RACI"], correctIndex: 2, hint: "Indice : Cette matrice utilise une échelle de 1 à 4 pour évaluer les risques." },
        { question: "19. Quel document inclut la formulation du projet, les objectifs, les activités et le cadre logique ?", options: ["Le plan d'affaires","Le document du projet","Le rapport d'évaluation","Le plan de communication"], correctIndex: 1, hint: "Indice : C'est le document complet qui décrit tous les aspects du projet." },
        { question: "20. Quelle phase du cycle de vie inclut l'analyse des écarts entre planifié et réalisé ?", options: ["Conception","Planification","Réalisation","Clôture"], correctIndex: 3, hint: "Indice : Cette phase permet de tirer des enseignements pour les futurs projets." },
        { question: "21. Quelle organisation est caractérisée par des lignes de commandement claires ?", options: ["Hiérarchique","Divisionnaire","Matricielle","Fonctionnelle"], correctIndex: 0, hint: "Indice : C'est la structure organisationnelle la plus classique." },
        { question: "22. Quel outil de suivi permet de mesurer les performances du projet ?", options: ["Les indicateurs KPI","Le diagramme de Gantt","La méthode PERT","Le cadre logique"], correctIndex: 0, hint: "Indice : Ces outils sont définis dans le cadre logique du projet." },
        { question: "23. Quelle approche met l'accent sur les résultats concrets plutôt que sur les activités ?", options: ["Gestion de projet traditionnelle","Gestion axée sur les résultats (GAR)","Gestion agile","Ingénierie concourante"], correctIndex: 1, hint: "Indice : Cette approche implique de définir clairement les résultats attendus." },
        { question: "24. Quelle étape de l'évaluation finale implique la sélection d'un consultant indépendant ?", options: ["Élaboration des TDR","Sélection du consultant","Réalisation de l'évaluation","Rédaction du rapport"], correctIndex: 1, hint: "Indice : Cette étape garantit l'objectivité de l'évaluation." },
        { question: "25. Quel document inclut les prévisions de trésorerie et le compte de résultat prévisionnel ?", options: ["Sous-dossier juridique","Sous-dossier étude de marché","Sous-dossier technique","Sous-dossier financier"], correctIndex: 3, hint: "Indice : Ce document est essentiel pour évaluer la viabilité économique du projet." },
        { question: "26. Quelle phase du cycle de vie inclut la définition détaillée des tâches, des ressources et des délais ?", options: ["Conception","Planification","Réalisation","Clôture"], correctIndex: 1, hint: "Indice : Cette phase suit la conception et précède la réalisation." },
        { question: "27. Quel niveau du cadre logique correspond aux actions à mener pour obtenir les résultats ?", options: ["Objectif Global","Objectifs Spécifiques","Résultats","Activités"], correctIndex: 3, hint: "Indice : C'est le niveau le plus opérationnel du cadre logique." },
        { question: "28. Quelle méthode de gestion de projet utilise des cycles courts et une collaboration renforcée ?", options: ["Méthode traditionnelle","Méthode agile","Ingénierie concourante","Méthode PERT"], correctIndex: 1, hint: "Indice : Cette méthode est particulièrement adaptée aux projets complexes et incertains." },
        { question: "29. Quel type de risque concerne l'utilisation de techniques nouvelles ?", options: ["Faisabilité technique","Faisabilité calendaire","Faisabilité financière","Risque politique"], correctIndex: 0, hint: "Indice : Ce risque est lié aux aspects techniques du projet." },
        { question: "30. Quelle fonction dans un processus consiste à valider les opérations ?", options: ["L'autorisation","La détention","L'enregistrement","Le contrôle"], correctIndex: 0, hint: "Indice : Cette fonction détermine qui a le pouvoir de décider." },
        { question: "31. Quel outil permet de visualiser les dépendances entre les tâches ?", options: ["Le diagramme de Gantt","La méthode PERT","La matrice RACI","Le cadre logique"], correctIndex: 0, hint: "Indice : Cet outil montre les tâches sous forme de barres horizontales." },
        { question: "32. Quelle phase du cycle de vie inclut le choix du chef de projet ?", options: ["Conception","Planification","Réalisation","Clôture"], correctIndex: 0, hint: "Indice : Le chef de projet est désigné dès le début du projet." },
        { question: "33. Quel document inclut l'analyse concurrentielle et la segmentation client ?", options: ["Sous-dossier juridique","Sous-dossier étude de marché","Sous-dossier technique","Sous-dossier financier"], correctIndex: 1, hint: "Indice : Ce document permet d'évaluer la viabilité commerciale du projet." },
        { question: "34. Quelle étape de la clôture de projet implique l'audit des comptes ?", options: ["Information aux partenaires","Liquidation des droits du personnel","Apurement des dettes","Audit des comptes"], correctIndex: 3, hint: "Indice : Cette étape garantit la transparence financière du projet." },
        { question: "35. Quel type d'organisation est basé sur des divisions ou filiales autonomes ?", options: ["Hiérarchique","Divisionnaire","Matricielle","Fonctionnelle"], correctIndex: 1, hint: "Indice : Cette structure est courante dans les grandes entreprises." },
        { question: "36. Quelle matrice utilise une échelle de couleur pour représenter les niveaux de risque ?", options: ["Matrice SWOT","Matrice de planification","Matrice des risques","Matrice RACI"], correctIndex: 2, hint: "Indice : Cette matrice permet de visualiser rapidement les risques critiques." },
        { question: "37. Quel niveau du cadre logique correspond aux effets directs attendus du projet ?", options: ["Objectif Global","Objectifs Spécifiques","Résultats","Activités"], correctIndex: 1, hint: "Indice : Ce niveau est situé entre l'objectif global et les résultats." },
        { question: "38. Quelle méthode de planification utilise un réseau de tâches avec des durées optimistes, pessimistes et probables ?", options: ["Diagramme de Gantt","Méthode PERT","Méthode des potentiels","WBS"], correctIndex: 1, hint: "Indice : Cette méthode permet de gérer les incertitudes sur les durées." },
        { question: "39. Quelle phase du cycle de vie inclut la coordination de l'équipe projet ?", options: ["Conception","Planification","Réalisation","Clôture"], correctIndex: 2, hint: "Indice : Le chef de projet coordonne l'équipe pendant cette phase." },
        { question: "40. Quel document inclut les processus de production et les équipements ?", options: ["Sous-dossier juridique","Sous-dossier étude de marché","Sous-dossier technique","Sous-dossier financier"], correctIndex: 2, hint: "Indice : Ce document décrit comment le produit ou service sera réalisé." },
        { question: "41. Quelle fonction dans un processus consiste à tenir les comptes et les registres ?", options: ["L'autorisation","La détention","L'enregistrement","Le contrôle"], correctIndex: 2, hint: "Indice : Cette fonction est essentielle pour la traçabilité des opérations." },
        { question: "42. Quel outil permet de définir les responsabilités dans un projet ?", options: ["Diagramme de Gantt","Matrice RACI","Méthode PERT","Cadre logique"], correctIndex: 1, hint: "Indice : Cette matrice définit qui est Responsable, Accountable, Consulté et Informé." },
        { question: "43. Quelle étape de la gestion des risques implique de réduire la fréquence d'occurrence ?", options: ["Identification","Évaluation","Prévention","Protection"], correctIndex: 2, hint: "Indice : Cette étape vise à éviter que le risque ne se produise." },
        { question: "44. Quel type de risque concerne l'évaluation des durées réalistes ?", options: ["Faisabilité technique","Faisabilité calendaire","Faisabilité financière","Risque politique"], correctIndex: 1, hint: "Indice : Ce risque est lié au respect des délais du projet." },
        { question: "45. Quelle phase du cycle de vie inclut la capitalisation des connaissances ?", options: ["Conception","Planification","Réalisation","Clôture"], correctIndex: 3, hint: "Indice : Cette phase permet de tirer des enseignements pour les futurs projets." },
        { question: "46. Quel document inclut l'impact sur l'emploi et la responsabilité sociétale ?", options: ["Sous-dossier juridique","Sous-dossier étude de marché","Sous-dossier technique","Sous-dossier économique et social"], correctIndex: 3, hint: "Indice : Ce document évalue l'impact social du projet." },
        { question: "47. Quelle méthode de gestion de projet utilise la métaphore du 'rugby' ?", options: ["Méthode traditionnelle","Ingénierie concourante","Méthode agile","Méthode PERT"], correctIndex: 1, hint: "Indice : Cette méthode oppose la 'course de relais' du modèle séquentiel." },
        { question: "48. Quel niveau du cadre logique est validé par des indicateurs objectivement vérifiables ?", options: ["Objectif Global","Objectifs Spécifiques","Résultats","Tous les niveaux"], correctIndex: 3, hint: "Indice : Chaque niveau du cadre logique a ses propres indicateurs." },
        { question: "49. Quelle étape de la clôture de projet implique le règlement des désaccords avec les parties prenantes ?", options: ["Information aux partenaires","Liquidation des droits du personnel","Rédaction du rapport d'évaluation","Règlement des désaccords"], correctIndex: 3, hint: "Indice : Cette étape garantit l'acceptation des conclusions de l'évaluation." },
        { question: "50. Quelle fonction dans un processus consiste à vérifier les opérations ?", options: ["L'autorisation","La détention","L'enregistrement","Le contrôle"], correctIndex: 3, hint: "Indice : Cette fonction garantit la qualité et la conformité des opérations." }
    ];

    // Generate quiz pages
    function generateQuiz() {
        if (!quizContainer || !quizPagination) return;
        quizContainer.innerHTML = '';
        quizPagination.innerHTML = '';

        for (let page = 1; page <= totalPages; page++) {
            const pageDiv = document.createElement('div');
            pageDiv.className = `quiz-page ${page === currentPage ? 'active' : ''}`;
            pageDiv.id = `page${page}`;

            const startIndex = (page - 1) * questionsPerPage;
            const endIndex = Math.min(startIndex + questionsPerPage, totalQuestions);

            for (let i = startIndex; i < endIndex; i++) {
                const question = quizData[i];
                const questionDiv = document.createElement('div');
                questionDiv.className = 'quiz-container';
                questionDiv.innerHTML = `
                    <div class="quiz-question">${question.question}</div>
                    <div class="quiz-options">
                        ${question.options.map((option, idx) => `
                            <div class="quiz-option" data-index="${idx}" data-correct="${idx === question.correctIndex}">
                                ${option}
                            </div>
                        `).join('')}
                    </div>
                    <div class="quiz-feedback"></div>
                    <button class="hint-btn">💡 Indice</button>
                `;
                pageDiv.appendChild(questionDiv);
            }

            quizContainer.appendChild(pageDiv);
        }

        for (let page = 1; page <= totalPages; page++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-btn ${page === currentPage ? 'active' : ''}`;
            pageBtn.textContent = page;
            pageBtn.dataset.page = page;
            quizPagination.appendChild(pageBtn);
        }

        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                goToPage(parseInt(btn.dataset.page));
            });
        });
    }

    function goToPage(page) {
        if (page < 1 || page > totalPages) return;
        const current = document.querySelector('.quiz-page.active');
        if (current) current.classList.remove('active');
        const next = document.getElementById(`page${page}`);
        if (next) next.classList.add('active');
        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.page) === page);
        });
        currentPage = page;
        if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
        if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages;
    }

    // Initialize quiz
    generateQuiz();

    // Navigation buttons
    if (prevPageBtn) prevPageBtn.addEventListener('click', () => { if (currentPage > 1) goToPage(currentPage - 1); });
    if (nextPageBtn) nextPageBtn.addEventListener('click', () => { if (currentPage < totalPages) goToPage(currentPage + 1); });
    if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
    if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages;

    // Apply dark mode if saved
    if (darkMode) {
        document.body.classList.add('dark-mode');
        if (darkModeToggle) {
            darkModeToggle.querySelector('.dark').style.display = 'inline';
            darkModeToggle.querySelector('.no-dark').style.display = 'none';
        }
    } else if (darkModeToggle) {
        darkModeToggle.querySelector('.dark').style.display = 'none';
        darkModeToggle.querySelector('.no-dark').style.display = 'inline';
    }

    if (personalNotes) personalNotes.value = savedNotes;

    // Module Navigation
    if (moduleList) {
        moduleList.addEventListener('click', function(e) {
            if (e.target.classList.contains('module-item')) {
                const clickedItem = e.target;
                moduleItems.forEach(item => item.classList.remove('active'));
                clickedItem.classList.add('active');
                const targetModule = clickedItem.getAttribute('data-module');
                contentSections.forEach(section => {
                    section.classList.toggle('active', section.id === targetModule);
                });
                if (targetModule !== 'home' && targetModule !== 'dashboard') {
                    const moduleIndex = Array.from(moduleItems).findIndex(i => i.getAttribute('data-module') === targetModule);
                    const progress = Math.min(100, Math.max(25, moduleIndex * 15));
                    if (globalProgress) globalProgress.style.width = `${progress}%`;
                    if (progressStat) progressStat.textContent = `${progress}%`;
                }
                localStorage.setItem('currentModule', targetModule);
            }
        });
    }

    // Mindmap Navigation
    mindmapNodes.forEach(node => {
        node.addEventListener('click', () => {
            const targetModule = node.getAttribute('data-module');
            const targetItem = document.querySelector(`.module-item[data-module="${targetModule}"]`);
            if (targetItem) targetItem.click();
        });
    });
    if (mindmapCenter) mindmapCenter.addEventListener('click', () => { const homeItem = document.querySelector('.module-item[data-module="home"]'); if (homeItem) homeItem.click(); });

    // Flashcard
    if (flashcard) flashcard.addEventListener('click', () => flashcard.classList.toggle('flipped'));

    // Quiz event delegation
    if (quizContainer) {
        quizContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('quiz-option')) {
                const option = e.target;
                const optionsContainer = option.closest('.quiz-container').querySelector('.quiz-options');
                optionsContainer.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                if (answeredQuestions > 0) showFeedback(option);
            } else if (e.target.classList.contains('hint-btn')) {
                const hintBtn = e.target;
                const feedbackEl = hintBtn.previousElementSibling;
                const questionIndex = Array.from(quizContainer.querySelectorAll('.quiz-container')).indexOf(hintBtn.closest('.quiz-container'));
                const questionData = quizData[questionIndex];
                if (feedbackEl && feedbackEl.textContent.trim() === '') {
                    feedbackEl.textContent = questionData.hint;
                    feedbackEl.style.display = 'block';
                    feedbackEl.className = 'quiz-feedback feedback-incorrect';
                }
            }
        });
    }

    // Submit Quiz
    if (submitQuizBtn) {
        submitQuizBtn.addEventListener('click', () => {
            score = 0; answeredQuestions = 0;
            quizData.forEach((question, index) => {
                const questionContainer = document.querySelectorAll('.quiz-container')[index];
                const selectedOption = questionContainer ? questionContainer.querySelector('.quiz-option.selected') : null;
                if (selectedOption) {
                    answeredQuestions++;
                    showFeedback(selectedOption, questionContainer, question.correctIndex);
                    if (parseInt(selectedOption.dataset.index) === question.correctIndex) score++;
                }
            });
            if (quizScoreDisplay) quizScoreDisplay.textContent = `Score: ${score}/${answeredQuestions}`;
            setTimeout(() => {
                const percentage = Math.round((score / totalQuestions) * 100);
                let message = `Quiz terminé ! Votre score est de ${score}/50 (${percentage}%).\n\n`;
                if (percentage >= 80) message += "Excellent travail ! Vous maîtrisez parfaitement le contenu du cours.";
                else if (percentage >= 60) message += "Bon travail ! Vous avez de bonnes connaissances, mais quelques points méritent révision.";
                else if (percentage >= 40) message += "Des efforts sont nécessaires. Revoyez les modules concernés pour améliorer votre score.";
                else message += "Votre score est insuffisant. Je vous recommande de revoir l'intégralité du cours avant de repasser le quiz.";
                alert(message);
            }, 300);
        });
    }

    function showFeedback(option, container, correctIndex) {
        if (!container) container = option.closest('.quiz-container');
        if (!container) return;
        const feedbackEl = container.querySelector('.quiz-feedback');
        if (!feedbackEl) return;
        const allContainers = document.querySelectorAll('.quiz-container');
        const questionIndex = Array.from(allContainers).indexOf(container);
        const questionData = quizData[questionIndex];
        const isCorrect = parseInt(option.dataset.index) === (correctIndex !== undefined ? correctIndex : questionData.correctIndex);
        feedbackEl.textContent = isCorrect ? `✅ Bonne réponse ! ${getExplanation(questionIndex)}` : `❌ Mauvaise réponse. La bonne réponse est : ${questionData.options[questionData.correctIndex]}\n\n${getExplanation(questionIndex)}`;
        feedbackEl.className = isCorrect ? 'quiz-feedback feedback-correct' : 'quiz-feedback feedback-incorrect';
        feedbackEl.style.display = 'block';
    }

    function getExplanation(questionIndex) {
        const explanations = [
            "Le PMI définit le projet comme une entreprise temporaire visant à créer un produit et/ou un service unique.",
            "La criticité d'un risque est calculée en multipliant sa gravité par sa fréquence d'occurrence.",
            "La méthode PERT permet d'identifier le chemin critique grâce à son réseau de tâches et ses calculs de durées.",
            "Dans le cadre logique, les résultats correspondent aux biens, services ou changements produits par le projet.",
            "L'identification des risques est la première étape de la gestion des risques, avant toute évaluation ou traitement.",
            "La phase de conception inclut la définition des objectifs, l'étude de faisabilité et le choix du chef de projet.",
            "Le cadre logique est un outil qui présente de manière structurée les objectifs, indicateurs, hypothèses et intervenants d'un projet.",
            "Le diagramme de Gantt utilise des barres horizontales pour représenter visuellement les tâches et leur enchaînement dans le temps.",
            "L'organisation matricielle implique un double reporting : les employés répondent à la fois à leur manager fonctionnel et au chef de projet.",
            "La phase de clôture est la dernière étape du cycle de vie d'un projet, incluant l'évaluation et la capitalisation des connaissances.",
            "Le plan d'affaires est le document conceptuel utilisé pour les projets à but lucratif, incluant plusieurs sous-dossiers thématiques.",
            "Selon le principe des quatre fonctions incompatibles, l'autorisation, la détention, l'enregistrement et le contrôle ne doivent jamais être cumulés.",
            "La méthode PERT permet d'identifier le chemin critique grâce à son réseau de tâches et ses calculs de durées optimistes, pessimistes et probables.",
            "La phase de réalisation est celle où les tâches sont exécutées et où le chef de projet gère les imprévus.",
            "L'objectif global est le niveau le plus élevé du cadre logique, représentant l'impact à long terme sur le développement.",
            "Le brainstorming des axes stratégiques est la première étape de la planification stratégique, permettant de générer des idées en équipe.",
            "La faisabilité financière concerne la disponibilité des budgets, l'origine des fonds et la couverture des dépenses du projet.",
            "La matrice des risques permet de prioriser les risques en fonction de leur gravité et de leur probabilité d'occurrence.",
            "Le document du projet est le document complet qui inclut la formulation, les objectifs, les activités, le cadre logique et bien plus encore.",
            "La phase de clôture inclut l'analyse des écarts entre ce qui était planifié et ce qui a été réalisé, pour tirer des enseignements.",
            "L'organisation hiérarchique est caractérisée par des lignes de commandement claires et une structure pyramidale classique.",
            "Les indicateurs KPI (Key Performance Indicators) sont des outils de suivi qui permettent de mesurer les performances du projet.",
            "La Gestion Axée sur les Résultats (GAR) met l'accent sur les résultats concrets plutôt que sur les activités réalisées.",
            "La sélection d'un consultant indépendant est une étape cruciale de l'évaluation finale pour garantir son objectivité.",
            "Le sous-dossier financier d'un plan d'affaires inclut les prévisions de trésorerie et le compte de résultat prévisionnel.",
            "La phase de planification inclut la définition détaillée des tâches, des ressources, des délais et des coûts du projet.",
            "Les activités sont le niveau le plus opérationnel du cadre logique, correspondant aux actions à mener pour obtenir les résultats.",
            "La méthode agile utilise des cycles courts (sprints) et une collaboration renforcée pour s'adapter aux changements.",
            "La faisabilité technique concerne les aspects techniques du projet, comme l'utilisation de techniques nouvelles ou les performances à obtenir.",
            "L'autorisation est la fonction qui consiste à valider les opérations, déterminant qui a le pouvoir de décision.",
            "Le diagramme de Gantt permet de visualiser les dépendances entre les tâches grâce à l'alignement des barres horizontales.",
            "La phase de conception inclut le choix du chef de projet, qui sera responsable de la conduite du projet.",
            "Le sous-dossier étude de marché inclut l'analyse concurrentielle et la segmentation client pour évaluer la viabilité commerciale.",
            "L'audit des comptes est une étape de la clôture de projet qui garantit la transparence financière et la conformité.",
            "L'organisation divisionnaire est basée sur des divisions ou filiales autonomes, souvent utilisée dans les grandes entreprises.",
            "La matrice des risques utilise une échelle de couleur (vert, jaune, orange, rouge) pour représenter visuellement les niveaux de risque.",
            "Les objectifs spécifiques sont situés entre l'objectif global et les résultats dans le cadre logique, représentant les effets directs attendus.",
            "La méthode PERT utilise un réseau de tâches avec des durées optimistes, pessimistes et probables pour gérer les incertitudes.",
            "La phase de réalisation inclut la coordination de l'équipe projet par le chef de projet pour assurer l'exécution des tâches.",
            "Le sous-dossier technique d'un plan d'affaires décrit les processus de production et les équipements nécessaires.",
            "L'enregistrement est la fonction qui consiste à tenir les comptes et les registres, essentielle pour la traçabilité.",
            "La matrice RACI est un outil qui permet de définir les responsabilités dans un projet (Responsable, Accountable, Consulté, Informé).",
            "La prévention est l'étape de la gestion des risques qui vise à réduire la fréquence d'occurrence des risques.",
            "La faisabilité calendaire concerne l'évaluation des durées réalistes et le respect des délais du projet.",
            "La phase de clôture inclut la capitalisation des connaissances pour tirer des enseignements des succès et des échecs du projet.",
            "Le sous-dossier économique et social évalue l'impact du projet sur l'emploi et sa responsabilité sociétale.",
            "L'ingénierie concourante utilise la métaphore du 'rugby' pour décrire son approche collaborative, contrairement à la 'course de relais' du modèle séquentiel.",
            "Tous les niveaux du cadre logique (objectif global, objectifs spécifiques, résultats, activités) sont validés par des indicateurs objectivement vérifiables.",
            "Le règlement des désaccords avec les parties prenantes est une étape importante de la clôture pour garantir l'acceptation des conclusions.",
            "Le contrôle est la fonction qui consiste à vérifier les opérations pour garantir leur qualité et leur conformité."
        ];
        return explanations[questionIndex] || "";
    }

    // Dark Mode Toggle
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            darkMode = !darkMode;
            document.body.classList.toggle('dark-mode', darkMode);
            if (darkMode) {
                darkModeToggle.querySelector('.dark').style.display = 'inline';
                darkModeToggle.querySelector('.no-dark').style.display = 'none';
            } else {
                darkModeToggle.querySelector('.dark').style.display = 'none';
                darkModeToggle.querySelector('.no-dark').style.display = 'inline';
            }
            localStorage.setItem('darkMode', darkMode);
        });
    }

    // Save Notes
    if (personalNotes) {
        personalNotes.addEventListener('input', () => {
            localStorage.setItem('courseNotes', personalNotes.value);
        });
    }

    // Export Functionality (simulated)
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            alert('Fonctionnalité d\'export PDF activée.\n\nDans une version complète, cette fonction générerait un PDF de vos notes, du contenu du module actuel et de votre progression.');
        });
    }

    // Notes Button
    if (notesBtn) {
        notesBtn.addEventListener('click', () => {
            const dashboardItem = document.querySelector('.module-item[data-module="dashboard"]');
            if (dashboardItem) {
                dashboardItem.click();
                setTimeout(() => { if (personalNotes) personalNotes.scrollIntoView({behavior: 'smooth'}); }, 300);
            }
        });
    }

    // Search Functionality (simplified)
    if (courseSearch) {
        courseSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            moduleItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(searchTerm) ? 'block' : 'none';
            });
        });
    }

    // Initialize progress from localStorage
    const savedProgress = localStorage.getItem('courseProgress');
    if (savedProgress && globalProgress) {
        globalProgress.style.width = savedProgress;
        if (progressStat) progressStat.textContent = savedProgress;
    }

    // Save progress when leaving page
    window.addEventListener('beforeunload', () => {
        if (globalProgress) localStorage.setItem('courseProgress', globalProgress.style.width);
    });

    // Initialize accordions
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isActive = header.classList.contains('active');
            document.querySelectorAll('.accordion-header').forEach(h => h.classList.remove('active'));
            document.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('show'));
            if (!isActive) { header.classList.add('active'); content.classList.add('show'); }
        });
    });

    // Initialize with home module active
    const homeItem = document.querySelector('.module-item[data-module="home"]');
    if (homeItem && !homeItem.classList.contains('active')) homeItem.click();
});