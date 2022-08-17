const paymentForm = document.getElementById('paymentForm');
paymentForm.addEventListener("submit", payWithPaystack, false);
function payWithPaystack(e) {
    e.preventDefault();

    let handler = PaystackPop.setup({
        key: 'pk_live_bee3c33ba80bbab332dd4b4af3461c775124b733', // Replace with your public key
        email: document.getElementById("email-address").value,
        amount: document.getElementById("amount").value * 100,
        ref: '' + Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
        // label: "Optional string that replaces customer email"
        onClose: function () {
            window.location.href = "#";
        },
        callback: function (response) {
            let message = 'Payment complete! Reference: ' + response.reference;
            alert(message);
            window.location.href = "#";
        }
    });

    handler.openIframe();
}