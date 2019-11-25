import { serverRender } from "../renderer/serverRender";
import fetch from "isomorphic-fetch";

module.exports = {
  name: "route-handling",
  version: "1.0.0",
  register: async function(server) {
    // Main Page
    server.route({
      method: "GET",
      path: "/",
      handler: function(request, h) {
        const { cssData, htmlData, initialState } = serverRender(request, {
          count: 100
        });

        return h.view("index", {
          pageTitle: "home",
          cssData,
          htmlData,
          initialState
        });
      }
    });

    // BrowseTutor
    server.route({
      method: "GET",
      path: "/browse",
      handler: async (request, h) => {
        // getting user param query (backend)
        const qParam = request.query.id ? `?id=${request.query.id}` : ``;
        const uri = `http://localhost:3000/api/tutor${qParam}`;

        console.log(`qParam: ${qParam}`);
        // fetch from api
        const res = await fetch(uri);
        const dataObj = await res.json();

        const state = { tutor: dataObj };

        const { cssData, htmlData, initialState } = serverRender(
          request,
          state
        );

        return h.view("index", {
          pageTitle: "Browse - Tutors",
          cssData,
          htmlData,
          initialState
        });
      }
    });

    // /test
    server.route({
      method: "GET",
      path: "/test",
      handler: function(request, h) {
        const { cssData, htmlData, initialState } = serverRender(request, {});

        return h.view("index", {
          pageTitle: "test",
          cssData,
          htmlData,
          initialState
        });
      }
    });
  }
};
