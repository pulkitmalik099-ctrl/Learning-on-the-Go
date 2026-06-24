/* search-index.js — card data for cross-deck search on the home page.
   Keep in sync with each deck's CARDS array when you add or edit cards. */
var SEARCH_INDEX = [
  {
    deckId: 'get-started-with-claude',
    deckTitle: 'Get Started with Claude',
    cards: [
      { q: 'What is Claude?', a: 'An AI assistant made by Anthropic, designed to be helpful, harmless, and honest. It can write, analyse, code, research, and hold extended conversations.' },
      { q: 'What are the three pillars of Claude\'s design?', a: 'Helpful, Harmless, and Honest — Claude is built to be useful to users while avoiding harm and being truthful.' },
      { q: 'What is a prompt?', a: 'Text you send to Claude to start or continue a conversation. A good prompt is clear, specific, and provides enough context for Claude to give a useful response.' },
      { q: 'How do you get better results from Claude?', a: 'Be specific about your goal, provide relevant context, specify the format you want, and iterate — ask Claude to revise or expand if the first answer isn\'t quite right.' },
      { q: 'What are the three main modes in the Claude desktop app?', a: 'Chat (conversational Q&A), Cowork (collaborative document creation), and Code (coding assistance and debugging).' },
      { q: 'What is the Chat mode used for?', a: 'Open-ended conversation — asking questions, brainstorming, summarising content, getting explanations, or any general task.' },
      { q: 'What is Cowork mode in the Claude desktop app?', a: 'A collaborative workspace where you and Claude work together on documents, drafts, or structured content in real time.' },
      { q: 'What is Code mode in the Claude desktop app?', a: 'A specialised environment for writing, reviewing, debugging, and explaining code across many programming languages.' },
      { q: 'What are Projects in Claude?', a: 'A way to organise related conversations, files, and instructions in one place so Claude has consistent context across multiple sessions on the same topic.' },
      { q: 'What is the benefit of using Projects?', a: 'Claude remembers the context, uploaded documents, and custom instructions you set for that project — no need to re-explain your situation each session.' },
      { q: 'What are Artifacts in Claude?', a: 'Standalone, reusable outputs Claude creates — such as a document, code file, table, or diagram — that you can copy, download, or build on.' },
      { q: 'How do you create an Artifact?', a: 'Ask Claude to produce a self-contained output (e.g. "write a Python script" or "create a report"). Claude renders it in a separate panel so you can work with it independently.' },
      { q: 'What are Skills in Claude?', a: 'Pre-built or custom capabilities that extend what Claude can do — for example, browsing the web, running code, or following a specific workflow you\'ve defined.' },
      { q: 'What does "Connecting your tools" mean in Claude?', a: 'Integrating Claude with external apps and services (calendar, email, Slack, etc.) so it can retrieve information and take actions across your workflow.' },
      { q: 'What is Enterprise Search in Claude?', a: 'A feature that lets Claude search across your organisation\'s connected data sources (documents, wikis, emails) to find relevant information and include it in answers.' },
      { q: 'What is Research Mode in Claude?', a: 'A deep-dive capability where Claude performs multiple searches and synthesises information from many sources to produce a thorough, cited research report.' },
      { q: 'When should you use Research Mode?', a: 'For complex questions that benefit from broad information gathering — competitive analysis, literature reviews, market research, or any topic where depth matters.' },
      { q: 'What is the context window?', a: 'The maximum amount of text (your messages + Claude\'s replies + any files) that Claude can process in one conversation. Information outside the window is not visible to Claude.' },
      { q: 'How can you use Claude by role — e.g. as a marketer?', a: 'Marketers can use Claude to draft campaigns, write copy, analyse customer feedback, and brainstorm ideas — prompting Claude with role-specific context for tailored output.' },
      { q: 'How can developers use Claude?', a: 'For code generation, debugging, code review, writing tests, explaining legacy code, and getting documentation — in Code mode or via the API.' },
      { q: 'How can executives or managers use Claude?', a: 'To summarise reports, prepare talking points, draft emails, analyse data, and get quick briefings — saving time on high-volume reading and writing tasks.' },
      { q: 'What are some everyday use cases for Claude?', a: 'Writing and editing, summarising long documents, brainstorming, answering questions, drafting emails, explaining complex topics, and coding assistance.' },
      { q: 'What should you do when Claude\'s answer is not quite right?', a: 'Iterate — tell Claude what was off ("too long", "wrong tone", "focus on X instead") and it will revise. Good prompting is a conversation, not a one-shot command.' },
      { q: 'Does Claude require an Anthropic account to take the Claude 101 course?', a: 'No — the course on Skilljar is free to access with just an email registration, separate from an Anthropic account.' },
      { q: 'What can you earn at the end of the Claude 101 course?', a: 'A certificate of completion from Anthropic, demonstrating proficiency with Claude\'s core features and everyday use cases.' }
    ]
  },
  {
    deckId: 'sql',
    deckTitle: 'SQL',
    cards: [
      { q: 'What is a PRIMARY KEY?', a: 'A column (or set of columns) that uniquely identifies each row in a table. It cannot be NULL and must be unique across all rows.' },
      { q: 'What is a FOREIGN KEY?', a: 'A column that references the PRIMARY KEY of another table, enforcing referential integrity — a row cannot reference a parent row that does not exist.' },
      { q: 'What is database normalization?', a: 'Organising tables to reduce data redundancy. 1NF removes repeating groups; 2NF removes partial dependencies; 3NF removes transitive dependencies.' },
      { q: 'What does INNER JOIN return?', a: 'Only rows where a matching record exists in BOTH tables. Rows with no match on either side are excluded.' },
      { q: 'What does LEFT JOIN (LEFT OUTER JOIN) return?', a: 'All rows from the left table, plus matching rows from the right. Where no match exists, right-table columns are NULL.' },
      { q: 'What is a database INDEX?', a: 'A data structure (typically a B-tree) built on a column to speed up SELECT queries at the cost of extra storage and slightly slower writes.' },
      { q: 'What is a database transaction?', a: 'A sequence of SQL statements executed as a single unit — either all succeed and commit, or all fail and roll back, leaving the database unchanged.' },
      { q: 'What are the ACID properties?', a: 'Atomicity (all-or-nothing), Consistency (valid state always maintained), Isolation (concurrent transactions do not interfere), Durability (committed data survives failures).' },
      { q: 'What is a VIEW?', a: 'A named saved SELECT query that acts as a virtual table. It does not store data itself (unless materialized) and always reflects the underlying tables.' },
      { q: 'What is a STORED PROCEDURE?', a: 'Precompiled SQL code stored in the database that can accept parameters, execute logic, and be called by name from applications or other SQL.' },
      { q: 'What is the difference between WHERE and HAVING?', a: 'WHERE filters individual rows BEFORE aggregation. HAVING filters groups AFTER a GROUP BY clause has been applied.' },
      { q: 'What is a subquery?', a: 'A SELECT statement nested inside another query, used as a filter condition, a scalar value, or a derived table in the FROM clause.' },
      { q: 'UNION vs UNION ALL — what is the difference?', a: 'UNION removes duplicate rows between result sets; UNION ALL keeps all rows including duplicates and is faster because it skips the deduplication step.' },
      { q: 'What is a CTE (Common Table Expression)?', a: 'A named temporary result set defined with WITH before a query. It improves readability and can be recursive, unlike a plain subquery.' },
      { q: 'What is a window function?', a: 'A function (e.g. ROW_NUMBER, RANK, SUM OVER) that calculates a value across a set of rows related to the current row without collapsing them into one.' },
      { q: 'What does EXPLAIN (or EXPLAIN ANALYZE) do?', a: 'Shows the query execution plan — the steps the database will take (or did take) to retrieve data, useful for spotting missing indexes or slow joins.' },
      { q: 'What is denormalization?', a: 'Intentionally adding redundancy back into a schema (e.g. caching a join result as a column) to speed up reads at the cost of storage and write complexity.' },
      { q: 'What is database sharding?', a: 'Horizontal partitioning of data across multiple servers, where each shard holds a subset of rows, allowing the system to scale writes and storage beyond one machine.' },
      { q: 'What is database replication?', a: 'Copying data from a primary server to one or more replicas so reads can be distributed and a replica can take over if the primary fails.' },
      { q: 'What is an ORM?', a: 'Object-Relational Mapper — a library that maps database rows to objects in code, letting developers query and manipulate data without writing raw SQL (e.g. Entity Framework, SQLAlchemy).' }
    ]
  }
];
