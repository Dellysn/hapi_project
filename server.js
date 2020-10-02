const Hapi = require("@hapi/hapi");
const Port = process.env.PORT || 3000;
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const Path = require("path");
// create a server config
const server = Hapi.server({
  host: "localhost",
  port: Port,
  routes: {
    files: {
      relativeTo: Path.join(__dirname, "public"),
    },
  },
});

const config = async () => {
  await server.register(Inert);
  await server.register(Vision);

  server.views({
    engines: {
      html: require("handlebars"),
    },
    relativeTo: __dirname,
    path: "./views",
    partialsPath: "./views/partials",
    layout: true,
    layoutPath: "./views/layouts",
  });
  // static file route
  server.route({
    method: "GET",
    path: "/{params*}",
    handler: {
      directory: {
        path: ".",
      },
    },
  });
  server.route([
    {
      method: "GET",
      path: "/",
      handler: (request, h) => {
        return h.view("index.html");
      },
    },

    {
      method: "GET",
      path: "/re",
      handler: (request, h) => {
        const name = request.query.name;
        const age = request.query.age;
        return {
          name,
          age,
        };
      },
    },
  ]);

  await server.start();
  console.log("Server listening on port ", server.info.uri);
};
config();
// handling unhandledRejection Error
process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});
