use wasm_bindgen::prelude::*;
use std::f64::consts::PI;

#[wasm_bindgen]
pub fn greetings(name: &str) {
    alert(&format!("Hello, {}!", name));
}

#[wasm_bindgen]
extern {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    // The `console.log` is quite polymorphic, so we can bind it with multiple
    // signatures. Note that we need to use `js_name` to ensure we always call
    // `log` in JS.
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: u32);

    // Multiple arguments too!
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_many(a: &str, b: &str);
}

#[wasm_bindgen]
pub fn greet() -> String {
    "Svelte".into()
}

#[wasm_bindgen]
pub fn add(n1: i32, n2: i32) -> i32 {
    n1 + n2
}

fn convert(x: f64) -> i32 {
    x as i32
}

#[wasm_bindgen]
pub struct ExportedTupleStruct(pub i32, pub i32);

#[wasm_bindgen]
pub fn loc(angle: f64, distance: f64) -> ExportedTupleStruct {
    let angle_temp = angle * PI / 180.0;
    let x = convert(angle_temp.sin() * distance);
    let y = convert(angle_temp.cos() * distance);
    // log_many(x.to_string().as_str(), y.to_string().as_str());
    ExportedTupleStruct(x, y)
}

