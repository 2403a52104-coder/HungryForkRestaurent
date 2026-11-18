# The Hungry Fork — Restaurant Website

A responsive React + Vite restaurant website with menu browsing, a cart, online order requests, and table reservations.

## 1. Deploy with GitHub and Vercel

1. Create a new **public or private** GitHub repository named `the-hungry-fork`.
2. Upload the contents of this ZIP (not the outer ZIP folder) so `package.json`, `index.html`, `src/`, and `supabase-schema.sql` are at the repository root.
3. In Vercel, choose **Add New → Project**, import the repository.
4. Framework: Vite; Root Directory: `./`; Build Command: `npm run build`; Output Directory: `dist`.
5. Deploy. The site works in demo mode before Supabase is connected.

## 2. Create Supabase tables

1. Create a Supabase project.
2. Open SQL Editor → New query.
3. Copy all of `supabase-schema.sql` from this repository into the editor.
4. Click Run.
5. You should see `orders` and `reservations` in Table Editor.

## 3. Connect Supabase to Vercel

In Supabase Project Settings → API Keys, copy:
- Project URL (the base URL, without `/rest/v1/`)
- Publishable key (`sb_publishable_...`)

In Vercel → Project → Settings → Environment Variables, add:

| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase publishable key |

The `VITE_` prefix means the values are bundled into browser code. This is expected for the Supabase URL and publishable key. Never use a Supabase secret or service-role key in a `VITE_` variable.

Redeploy after saving the variables.

## 4. Test

- Add menu items to the cart and place a test order.
- Submit a table reservation.
- In Supabase → Table Editor, check `orders` and `reservations`.

## Notes

- The menu is currently stored in `src/App.jsx` as sample menu data. Edit `menuItems` to change names, descriptions, prices and image URLs.
- Images are loaded from Unsplash URLs and require an internet connection.
- This starter stores incoming orders and reservation requests. It does not process online payments, send confirmation emails/SMS, or include a secured staff/admin dashboard.
- The SQL intentionally allows public INSERT requests so visitors can order and reserve without creating accounts. It does not allow public SELECT access to customer records. Before a real commercial launch, add server-side validation, spam protection/rate limiting, and a secure staff workflow to view and manage requests.
- Replace the sample restaurant address and phone number with your actual details before presenting.
