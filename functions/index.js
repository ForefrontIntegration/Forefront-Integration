/**
 * Import necessary Firebase and Stripe libraries.
 */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")(functions.config().stripe.secret_key);

admin.initializeApp();

/**
 * Creates a Stripe Checkout session for a given product.
 *
 * This function is an HTTP endpoint that you can call from your frontend.
 * It takes a product ID from the request and uses it to create a new
 * Stripe Checkout session. This is the secure way to handle payments,
 * as the Stripe secret key is kept on the server.
 */
exports.createStripeCheckoutSession = functions.https.onCall(
  async (data, context) => {
    // Check if the user is authenticated.
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated."
      );
    }

    try {
      const {
        productId
      } = data;
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
          // The Stripe API expects a price ID, but you are
          // providing a product ID. You will need to create a
          // price in the Stripe dashboard and use its ID here.
          price: productId,
          quantity: 1,
        }, ],
        mode: "payment",
        success_url: "https://your-website.com/success.html", // TODO: Update this URL
        cancel_url: "https://your-website.com/cancel.html", // TODO: Update this URL
      });

      return {
        sessionId: session.id
      };
    } catch (error) {
      // Log the error to the Firebase console for debugging.
      console.error("Error creating Stripe Checkout session:", error);

      throw new functions.https.HttpsError(
        "internal",
        "Unable to create a Stripe Checkout session."
      );
    }
  }
);
