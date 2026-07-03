const fs = require('fs');

class PuzzleSolver {
    constructor(filePath){
        this.filePath = filePath;
        this.fragments = [];
        this.graph = {};
        this.inDegrees = {};
        this.longestPath = [];
    }

    loadData(){
        const rawText = fs.readFileSync(this.filePath, 'utf8');
        this.fragments = rawText.trim().split(/\s+/).filter(Boolean);
    }

    buildGraph(){
        for(const fragment of this.fragments){
            this.graph[fragment] = [];
            this.inDegrees[fragment] = 0;
        }

        for(let i = 0; i < this.fragments.length; i++){
            const current = this.fragments[i];
            const suffix = current.slice(-2);

            for(let j = 0; j < this.fragments.length; j++){
                if(i === j) continue;

                const candidate = this.fragments[j];
                const prefix = candidate.slice(0, 2);

                if(suffix === prefix){
                    this.graph[current].push(candidate);
                    this.inDegrees[candidate]++;
                }
            }
        }
    }

    dfs(currentNode, currentPath, visited){
        let isDeadEnd = true;

        for(const neighbor of this.graph[currentNode]){
            if(!visited.has(neighbor)){
                isDeadEnd = false;

                visited.add(neighbor);
                currentPath.push(neighbor);

                this.dfs(neighbor, currentPath, visited);

                visited.delete(neighbor);
                currentPath.pop();
            }
        }

        if(isDeadEnd && currentPath.length > this.longestPath.length){
            this.longestPath = [...currentPath];
        }
    }

    findLongestPath(){
        const startNodes = [...this.fragments].sort((a, b) => this.inDegrees[a] - this.inDegrees[b]);

        for(const node of startNodes){
            const visited = new Set([node]);

            this.dfs(node, [node], visited);
        }
    }

    getFormatedResult(){
        if(this.longestPath.length === 0) return '';

        let result = this.longestPath[0];

        for(let i = 1; i < this.longestPath.length; i++){
            result += this.longestPath[i].slice(2);
        }

        return result;
    }

    solve(){
        console.log('Start of analysis...');
        this.loadData();
        console.log(`Fragments loaded: ${this.fragments.length}`);
        
        console.time('Constructing the graph took')
        this.buildGraph();
        console.timeEnd('Constructing the graph took');

        console.time('Finding the longest path took');
        this.findLongestPath();
        console.timeEnd('Finding the longest path took');

        console.log('\n--Result--');
        console.log(`Length: ${this.longestPath.length} fragments`);
        const finalString = this.getFormatedResult();
        console.log(`Final line: \n${finalString}`);
        console.log(`Length in characters: ${finalString.length}`);
    }
}

const solver = new PuzzleSolver('source.txt'); // потрібно підставити власний шлях до файлу з тестовими даними
solver.solve();