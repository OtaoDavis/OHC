const COURSE_CONFIG = {
  fixed_income: {
    id: "fixed_income",
    name: "Fixed Income Analysis & Investments",
    amount: 100, // KES 1.00 — update to real amount before going live
    currency: "KES",
    image: "images/fixed-income.jpg",
    kajabi_offer: "cvXpLZGs",
  },

  equity: {
    id: "equity",
    name: "	Equity Analysis and Investments",
    amount: 100, // KES 1.00 — update to real amount before going live
    currency: "KES",
    image: "images/equity.png",
    kajabi_offer: "CJLCQpeE",
  },

  derivatives: {
    id: "derivatives",
    name: "Derivatives 101, Instruments, Valuation, Greeks and Strategies",
    amount: 100, // KES 1.00 — update to real amount before going live
    currency: "KES",
    image: "images/derivatives.png",
    kajabi_offer: "Hryxyppr",
  },

  lmrss: {
    id: "lmrss",
    name: "LMRSS Day Trading",
    amount: 100, // KES 1.00 — update to real amount before going live
    currency: "KES",
    image: "images/lmrss.png",
    kajabi_offer: "2wijefFy",
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
        key: "pk_test_2747ccc10e2497ac0d25e8064e17e99018c8d630",

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
          window.location.href = `/success.html?ref=${response.reference}&course=${encodeURIComponent(selectedCourse.name)}`;
        },

        onClose: function () {
          alert("Payment cancelled");
        },
      });

      handler.openIframe();
    });
  }
});
