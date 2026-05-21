const COURSE_CONFIG = {
  fixed_income: {
    id: "fixed_income",
    name: "Fixed Income Analysis & Investments",
    amount: 25000, // USD 250.00
    currency: "USD",
    image: "images/fixed-income.jpg",
    kajabi_offer: "cvXpLZGs",
  },

  equity: {
    id: "equity",
    name: "	Equity Analysis and Investments",
    amount: 25000, // USD 250.00
    currency: "USD",
    image: "images/equity.png",
    kajabi_offer: "CJLCQpeE",
  },

  derivatives: {
    id: "derivatives",
    name: "Derivatives 101, Instruments, Valuation, Greeks and Strategies",
    amount: 100000, // USD 1,000.00
    currency: "USD",
    image: "images/derivatives.png",
    kajabi_offer: "Hryxyppr",
  },

  lmrss: {
    id: "lmrss",
    name: "LMRSS Day Trading",
    amount: 100000, // USD 1,000.00
    currency: "USD",
    image: "images/lmrss.png",
    kajabi_offer: "2wijefFy",
  },

  foundation: {
    id: "foundation-path",
    name: "Foundation Path Bundle",
    amount: 34900, // $349.00 in cents
    currency: "USD",
    image: "images/foundation.jpg",
    kajabi_offer: "35HR5S5m",
  },
  trader: {
    id: "trader-path",
    name: "Trader Path Bundle",
    amount: 89900, // $899.00 in cents
    currency: "USD",
    image: "images/trader.jpg",
    kajabi_offer: "GU6kJScX",
  },
  investor: {
    id: "investor-path",
    name: "Investor Path Bundle",
    amount: 109900, // $1,099.00 in cents
    currency: "USD",
    image: "images/investor.webp",
    kajabi_offer: "Eag8wEbS",
  },
  ultimate: {
    id: "ultimate-path",
    name: "Ultimate Path Bundle",
    amount: 149900, // $1,499.00 in cents
    currency: "USD",
    image: "images/ultimate.jpg",
    kajabi_offer: "yDT9hkwp",
  },
};

/* -------------------------
   STATE
-------------------------- */
let selectedCourse = null;

/* -------------------------
   MODAL HANDLERS
-------------------------- */
function openModal(courseId) {
  selectedCourse = COURSE_CONFIG[courseId];

  if (!selectedCourse) {
    alert("Invalid course selected");
    return;
  }

  document.getElementById("modalCourseTitle").innerText = selectedCourse.name;
  document.getElementById("modalCoursePrice").innerText =
    `${selectedCourse.currency} ${(selectedCourse.amount / 100).toLocaleString()}`;
  document.getElementById("modalCourseImage").src = selectedCourse.image;

  // Clear previous inputs
  ["modalFirstName", "modalLastName", "modalEmail", "modalPhone"].forEach(
    (id) => (document.getElementById(id).value = ""),
  );

  document.getElementById("checkoutModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("checkoutModal").classList.add("hidden");
}

/* -------------------------
   INIT EVENT BINDINGS
-------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  // Attach click to all enroll buttons
  document.querySelectorAll(".paystack-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const courseId = this.dataset.courseId;
      openModal(courseId);
    });
  });

  // Pay button inside modal
  const payBtn = document.getElementById("modalPayBtn");

  if (payBtn) {
    payBtn.addEventListener("click", function () {
      const firstName = document.getElementById("modalFirstName").value.trim();
      const lastName = document.getElementById("modalLastName").value.trim();
      const email = document.getElementById("modalEmail").value.trim();
      const phone = document.getElementById("modalPhone").value.trim();

      // --- Validation ---
      if (!firstName) {
        alert("Please enter your first name");
        return;
      }
      if (!lastName) {
        alert("Please enter your last name");
        return;
      }
      if (!email) {
        alert("Please enter your email");
        return;
      }
      if (!phone) {
        alert("Please enter your phone number");
        return;
      }

      if (!selectedCourse) {
        alert("No course selected");
        return;
      }

      const fullName = `${firstName} ${lastName}`;

      /* -------------------------
         PAYSTACK CHECKOUT
      -------------------------- */
      let handler = PaystackPop.setup({
        //key: "pk_live_0c194eb0ca57df83c3faef74a63f2e652526a244", //live key
        key: "pk_test_b6f14decc508a38e3f525fd5d54f200bde1b01c3", //test key

        email: email,
        firstname: firstName, // Paystack native fields — appear on the receipt
        lastname: lastName,
        phone: phone,

        amount: selectedCourse.amount,
        currency: selectedCourse.currency,

        metadata: {
          course_id: selectedCourse.id,
          course_name: selectedCourse.name,
          first_name: firstName,
          last_name: lastName,
          full_name: fullName,
          phone_number: phone,

          // custom_fields kept only for display on the Paystack payment receipt
          custom_fields: [
            {
              display_name: "Course",
              variable_name: "course_id",
              value: selectedCourse.id,
            },
            {
              display_name: "First Name",
              variable_name: "first_name",
              value: firstName,
            },
            {
              display_name: "Last Name",
              variable_name: "last_name",
              value: lastName,
            },
            {
              display_name: "Phone",
              variable_name: "phone_number",
              value: phone,
            },
          ],
        },

        callback: function (response) {
          const successUrl = new URL("success.html", window.location.href);
          successUrl.searchParams.set("ref", response.reference);
          successUrl.searchParams.set("course", selectedCourse.name);
          window.location.href = successUrl.toString();
        },

        onClose: function () {
          alert("Payment cancelled");
        },
      });

      handler.openIframe();
    });
  }
});
