const app = require("./server");
const PORT = process.env.SERVER_PORT;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
