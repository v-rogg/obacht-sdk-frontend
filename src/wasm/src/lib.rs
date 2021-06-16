use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn greetings(name: &str) {
    alert(&format!("Hello, {}!", name));
}

#[wasm_bindgen]
extern {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() -> String {
    "Svelte".into()
}

#[wasm_bindgen]
pub fn add(n1: i32, n2: i32) -> i32 {
    n1 + n2
}
