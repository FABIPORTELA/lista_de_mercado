document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("item-form");
    const input = document.getElementById("item-input");
    const list = document.getElementById("shopping-list");

    form.addEventListener("submit", e => {
        e.preventDefault();
        const itemText = input.value.trim();

        if(itemText) {
            const li = document.createElement("li");
            li.textContent = itemText;

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Excluir";
            deleteBtn.addEventListener("click", () => {
                list.removeChild(li);
            });

            li.appendChild(deleteBtn);
            list.appendChild(li);
            input.value = "";
        }
    });
});
