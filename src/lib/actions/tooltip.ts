import Tooltip from '$lib/Tooltip.svelte';

export function tooltip(element) {
    // let div;
    let title;
    let tooltipComponent;
    function mouseOver(event) {
        // NOTE: remove the `title` attribute, to prevent showing the default browser tooltip
        // remember to set it back on `mouseleave`
        title = element.getAttribute('title');
        element.removeAttribute('title');

        tooltipComponent = new Tooltip({
            props: {
                title: title,
                x: event.pageX,
                y: event.pageY,
            },
            target: document.body,
        });
    }
    function mouseMove(event) {
        tooltipComponent.$set({
            x: event.pageX,
            y: event.pageY,
        })
    }
    function mouseLeave() {
        tooltipComponent.$destroy();
        // NOTE: restore the `title` attribute
        element.setAttribute('title', title);
    }

    element.addEventListener('mouseover', mouseOver);
    element.addEventListener('mouseleave', mouseLeave);
    element.addEventListener('mousemove', mouseMove);

    return {
        destroy() {
            element.removeEventListener('mouseover', mouseOver);
            element.removeEventListener('mouseleave', mouseLeave);
            element.removeEventListener('mousemove', mouseMove);
        }
    }
}

// export function tooltip(element) {
//     let div;
//     let title;
//     function mouseOver(event) {
//         console.log("over");
//         // NOTE: remove the `title` attribute, to prevent showing the default browser tooltip
//         // remember to set it back on `mouseleave`
//         title = element.getAttribute('title');
//         element.removeAttribute('title');
//
//         div = document.createElement('div');
//         div.textContent = title;
//         div.style = `
// 			border: 1px solid #ddd;
// 			box-shadow: 1px 1px 1px #ddd;
// 			background: white;
// 			border-radius: 4px;
// 			padding: 4px;
// 			position: absolute;
// 			top: ${event.pageX + 5}px;
// 			left: ${event.pageY + 5}px;
// 		`;
//         document.body.appendChild(div);
//     }
//     function mouseMove(event) {
//         console.log("move");
//         div.style.left = `${event.pageX + 5}px`;
//         div.style.top = `${event.pageY + 5}px`;
//     }
//     function mouseLeave() {
//         console.log("leave");
//         document.body.removeChild(div);
//         // NOTE: restore the `title` attribute
//         element.setAttribute('title', title);
//     }
//
//     element.addEventListener('mouseover', mouseOver);
//     element.addEventListener('mouseleave', mouseLeave);
//     element.addEventListener('mousemove', mouseMove);
//
//     return {
//         destroy() {
//             element.removeEventListener('mouseover', mouseOver);
//             element.removeEventListener('mouseleave', mouseLeave);
//             element.removeEventListener('mousemove', mouseMove);
//         }
//     }
// }
