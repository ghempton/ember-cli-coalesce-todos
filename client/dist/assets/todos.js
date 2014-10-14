eval("//# sourceURL=assets/ember-cli/loader.js");

;eval("define(\"todos/app\", \n  [\"ember\",\"ember/resolver\",\"ember/load-initializers\",\"exports\"],\n  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n    var Resolver = __dependency2__[\"default\"];\n    var loadInitializers = __dependency3__[\"default\"];\n\n    Ember.MODEL_FACTORY_INJECTIONS = true;\n\n    var App = Ember.Application.extend({\n      modulePrefix: \'todos\', // TODO: loaded via config\n      Resolver: Resolver\n    });\n\n    loadInitializers(App, \'todos\');\n\n    __exports__[\"default\"] = App;\n  });//# sourceURL=todos/app.js");

;eval("define(\"todos/config/environment\", \n  [\"exports\"],\n  function(__exports__) {\n    \"use strict\";\n    __exports__[\"default\"] = {\"environment\":\"development\",\"baseURL\":\"/\",\"locationType\":\"auto\",\"EmberENV\":{\"FEATURES\":{}},\"APP\":{\"LOG_ACTIVE_GENERATION\":true,\"LOG_VIEW_LOOKUPS\":true}};\n  });//# sourceURL=todos/config/environment.js");

;eval("define(\"todos/config/environments/development\", \n  [\"exports\"],\n  function(__exports__) {\n    \"use strict\";\n    __exports__[\"default\"] = {\"environment\":\"development\",\"baseURL\":\"/\",\"locationType\":\"auto\",\"EmberENV\":{\"FEATURES\":{}},\"APP\":{\"LOG_ACTIVE_GENERATION\":true,\"LOG_VIEW_LOOKUPS\":true}};\n  });//# sourceURL=todos/config/environments/development.js");

;eval("define(\"todos/config/environments/test\", \n  [\"exports\"],\n  function(__exports__) {\n    \"use strict\";\n    __exports__[\"default\"] = {\"environment\":\"test\",\"baseURL\":\"/\",\"locationType\":\"auto\",\"EmberENV\":{\"FEATURES\":{}},\"APP\":{}};\n  });//# sourceURL=todos/config/environments/test.js");

;eval("define(\"todos/controllers/todos/index\", \n  [\"exports\"],\n  function(__exports__) {\n    \"use strict\";\n    __exports__[\"default\"] = Ember.ArrayController.extend({\n    	\n    });\n  });//# sourceURL=todos/controllers/todos/index.js");

;eval("define(\"todos/controllers/user\", \n  [\"exports\"],\n  function(__exports__) {\n    \"use strict\";\n    __exports__[\"default\"] = Ember.ObjectController.extend({\n    	\n    });\n  });//# sourceURL=todos/controllers/user.js");

;eval("define(\"todos/initializers/coalesce-setup\", \n  [\"todos/models/user\",\"todos/models/todo\",\"exports\"],\n  function(__dependency1__, __dependency2__, __exports__) {\n    \"use strict\";\n    var User = __dependency1__[\"default\"];\n    var Todo = __dependency2__[\"default\"];\n\n    var decamelize = Ember.String.decamelize,\n        underscore = Ember.String.underscore,\n        pluralize = Ember.String.pluralize;\n\n    var Serializer = CoalesceModelSerializer.extend({\n      keyForType: function(name, type, opts) {\n        var key = this._super(name, type);\n        if(!opts || !opts.embedded) {\n          if(type === \'belongs-to\') {\n            return key;\n          } else if(type === \'has-many\') {\n            return Ember.String.singularize(key);\n          }\n        }\n        return key;\n      }\n    });\n\n    var TodoSerializer = Serializer.extend({\n      properties: {\n        user: { embedded: true }\n      }\n    });\n\n    var UserSerializer = Serializer.extend({\n      properties: {\n        todos: { embedded: true }\n      }\n    });\n\n    var Adapter = CoalesceActiveModelAdapter.extend({\n    	host: \'http://localhost:3000\',\n      defaultSerializer: \'payload\',\n\n      setupContainer: function(parent) {\n        var container = this._super(parent);\n        container.register(\'serializer:model\', Serializer);\n        container.register(\'serializer:todo\', TodoSerializer);\n        container.register(\'serializer:user\', UserSerializer);\n        return container;\n      }\n    });\n\n    __exports__[\"default\"] = {\n      name: \'coalesce-setup\',\n      before: \'coalesce.container\',\n      initialize: function(container) {\n        container.register(\'adapter:application\', Adapter);\n      }\n    };\n  });//# sourceURL=todos/initializers/coalesce-setup.js");

;eval("define(\"todos/models/user\", \n  [\"exports\"],\n  function(__exports__) {\n    \"use strict\";\n    __exports__[\"default\"] = Coalesce.Model.extend({\n    	typeKey: \'user\',\n    	name: Coalesce.attr(\'string\'),\n    	todos: Coalesce.hasMany(\'todo\')\n    });\n  });//# sourceURL=todos/models/user.js");

;eval("define(\"todos/models/todo\", \n  [\"exports\"],\n  function(__exports__) {\n    \"use strict\";\n    __exports__[\"default\"] = Coalesce.Model.extend({\n    	typeKey: \'todo\',\n    	title: Coalesce.attr(\'string\'),\n    	description: Coalesce.attr(\'string\'),\n    	user: Coalesce.belongsTo(\'user\', {embedded: true})\n    });\n  });//# sourceURL=todos/models/todo.js");

;eval("define(\"todos/router\", \n  [\"ember\",\"exports\"],\n  function(__dependency1__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n\n    var Router = Ember.Router.extend({\n      location: TodosENV.locationType\n    });\n\n    Router.map(function() {\n    	this.resource(\'user\', {path: \'/user/:user_id\'}, function(){\n    		this.resource(\'todos\', function(){});\n    	});\n    });\n\n    __exports__[\"default\"] = Router;\n  });//# sourceURL=todos/router.js");

;eval("define(\"todos/routes/application\", \n  [\"ember\",\"exports\"],\n  function(__dependency1__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n\n    __exports__[\"default\"] = Ember.Route.extend({\n    	model: function(){\n    		return this.session.query(\'user\');\n    	},\n\n    	actions: {\n    		addUser: function(){\n    			var self = this;\n    			var user = this.session.create(\'user\', this.get(\"controller\").getProperties(\"name\"));\n\n    			self.get(\"controller.model\").pushObject(user);\n\n    			self.session.flush().then(null, function(){\n    				self.get(\"controller.model\").removeObject(user);				\n    			});\n    		}\n    	}\n    });\n  });//# sourceURL=todos/routes/application.js");

;eval("define(\"todos/routes/todos/index\", \n  [\"todos/models/todo\",\"exports\"],\n  function(__dependency1__, __exports__) {\n    \"use strict\";\n    var Todo = __dependency1__[\"default\"];\n\n    __exports__[\"default\"] = Ember.Route.extend({\n    	needs: [\'user\'],\n\n    	model: function(params){\n    		return this.modelFor(\'user\').get(\'todos\');\n    	},\n\n    	actions: {\n    		addTodo: function(){\n    			var self = this;\n    			var controller = this.get(\"controller\");\n\n    			var todo = this.session.create(\'todo\', {\n    				title: controller.get(\"title\"),\n    				description: controller.get(\"description\"),\n    				user: this.modelFor(\'user\')\n    			});\n\n    			self.session.flush().then(function(){\n    				debugger\n    			}, function(){\n    				self.get(\"controller.model\").removeObject(todo);				\n\n    			});\n    		}\n    	}\n    });\n  });//# sourceURL=todos/routes/todos/index.js");

;eval("define(\"todos/routes/user\", \n  [\"exports\"],\n  function(__exports__) {\n    \"use strict\";\n    __exports__[\"default\"] = Ember.Route.extend({\n    	model: function(params){\n    		return this.session.find(\'user\', params.user_id);\n    	}\n    });\n  });//# sourceURL=todos/routes/user.js");

;eval("define(\"todos/templates/application\", \n  [\"ember\",\"exports\"],\n  function(__dependency1__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n    __exports__[\"default\"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {\n    this.compilerInfo = [4,\'>= 1.0.0\'];\n    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};\n      var buffer = \'\', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;\n\n    function program1(depth0,data) {\n      \n      var buffer = \'\', helper, options;\n      data.buffer.push(\"\\n				<li>\");\n      data.buffer.push(escapeExpression((helper = helpers[\'link-to\'] || (depth0 && depth0[\'link-to\']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0,depth0],types:[\"ID\",\"STRING\",\"ID\"],data:data},helper ? helper.call(depth0, \"name\", \"todos.index\", \"id\", options) : helperMissing.call(depth0, \"link-to\", \"name\", \"todos.index\", \"id\", options))));\n      data.buffer.push(\"</li>\\n			\");\n      return buffer;\n      }\n\n      data.buffer.push(\"<div class=\\\"row\\\">\\n\\n	<div class=\\\"col-md-4\\\">\\n		<h1>Users</h1>\\n\\n		<form>\\n			\");\n      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{\n        \'value\': (\"name\"),\n        \'placeholder\': (\"name\")\n      },hashTypes:{\'value\': \"ID\",\'placeholder\': \"STRING\"},hashContexts:{\'value\': depth0,\'placeholder\': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, \"input\", options))));\n      data.buffer.push(\"\\n			<button \");\n      data.buffer.push(escapeExpression(helpers.action.call(depth0, \"addUser\", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:[\"STRING\"],data:data})));\n      data.buffer.push(\">Add</button>\\n		</form>\\n\\n		<ul>\\n			\");\n      stack1 = helpers.each.call(depth0, \"model\", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:[\"ID\"],data:data});\n      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }\n      data.buffer.push(\"\\n		</ul>\\n	</div>\\n\\n	<div class=\\\"col-md-8\\\">\\n		\");\n      stack1 = helpers._triageMustache.call(depth0, \"outlet\", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:[\"ID\"],data:data});\n      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }\n      data.buffer.push(\"\\n	</div>\\n\\n</div>\\n\");\n      return buffer;\n      \n    });\n  });//# sourceURL=todos/templates/application.js");

;eval("define(\"todos/templates/todos/index\", \n  [\"ember\",\"exports\"],\n  function(__dependency1__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n    __exports__[\"default\"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {\n    this.compilerInfo = [4,\'>= 1.0.0\'];\n    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};\n      var buffer = \'\', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;\n\n    function program1(depth0,data) {\n      \n      var buffer = \'\', stack1;\n      data.buffer.push(\"\\n		<li>\");\n      stack1 = helpers._triageMustache.call(depth0, \"title\", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:[\"ID\"],data:data});\n      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }\n      data.buffer.push(\" \");\n      stack1 = helpers._triageMustache.call(depth0, \"description\", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:[\"ID\"],data:data});\n      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }\n      data.buffer.push(\"</li>\\n	\");\n      return buffer;\n      }\n\n      data.buffer.push(\"<h1>Todos</h1>\\n\\n<form>\\n	\");\n      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{\n        \'value\': (\"title\"),\n        \'placeholder\': (\"title\")\n      },hashTypes:{\'value\': \"ID\",\'placeholder\': \"STRING\"},hashContexts:{\'value\': depth0,\'placeholder\': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, \"input\", options))));\n      data.buffer.push(\"\\n	\");\n      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{\n        \'value\': (\"description\"),\n        \'placeholder\': (\"description\")\n      },hashTypes:{\'value\': \"ID\",\'placeholder\': \"STRING\"},hashContexts:{\'value\': depth0,\'placeholder\': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, \"input\", options))));\n      data.buffer.push(\"\\n	<button \");\n      data.buffer.push(escapeExpression(helpers.action.call(depth0, \"addTodo\", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:[\"STRING\"],data:data})));\n      data.buffer.push(\">Add</button>\\n</form>\\n\\n<ul>\\n	\");\n      stack1 = helpers.each.call(depth0, \"model\", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:[\"ID\"],data:data});\n      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }\n      data.buffer.push(\"\\n</ul>\");\n      return buffer;\n      \n    });\n  });//# sourceURL=todos/templates/todos/index.js");

;eval("define(\"todos/templates/users\", \n  [\"ember\",\"exports\"],\n  function(__dependency1__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n    __exports__[\"default\"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {\n    this.compilerInfo = [4,\'>= 1.0.0\'];\n    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};\n      var buffer = \'\', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;\n\n    function program1(depth0,data) {\n      \n      var buffer = \'\', stack1;\n      data.buffer.push(\"\\n				<li>\");\n      stack1 = helpers._triageMustache.call(depth0, \"name\", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:[\"ID\"],data:data});\n      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }\n      data.buffer.push(\"</li>\\n			\");\n      return buffer;\n      }\n\n      data.buffer.push(\"<div class=\\\"row\\\">\\n\\n	<div class=\\\"col-md-4\\\">\\n		<h1>Users</h1>\\n\\n		<form>\\n			\");\n      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{\n        \'value\': (\"name\"),\n        \'placeholder\': (\"name\")\n      },hashTypes:{\'value\': \"ID\",\'placeholder\': \"STRING\"},hashContexts:{\'value\': depth0,\'placeholder\': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, \"input\", options))));\n      data.buffer.push(\"\\n			<button \");\n      data.buffer.push(escapeExpression(helpers.action.call(depth0, \"addUser\", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:[\"STRING\"],data:data})));\n      data.buffer.push(\">Add</button>\\n		</form>\\n\\n		<ul>\\n			\");\n      stack1 = helpers.each.call(depth0, \"model\", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:[\"ID\"],data:data});\n      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }\n      data.buffer.push(\"\\n		</ul>\\n	</div>\\n\\n	<div class=\\\"col-md-8\\\">\\n		\");\n      stack1 = helpers._triageMustache.call(depth0, \"outlet\", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:[\"ID\"],data:data});\n      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }\n      data.buffer.push(\"\\n	</div>\\n\\n</div>\");\n      return buffer;\n      \n    });\n  });//# sourceURL=todos/templates/users.js");

;eval("define(\"todos/tests/app.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - .\');\n    test(\'app.js should pass jshint\', function() { \n      ok(true, \'app.js should pass jshint.\'); \n    });\n  });//# sourceURL=todos/tests/app.jshint.js");

;eval("define(\"todos/tests/controllers/todos/index.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - controllers/todos\');\n    test(\'controllers/todos/index.js should pass jshint\', function() { \n      ok(false, \'controllers/todos/index.js should pass jshint.\\ncontrollers/todos/index.js: line 1, col 16, \\\'Ember\\\' is not defined.\\n\\n1 error\'); \n    });\n  });//# sourceURL=todos/tests/controllers/todos/index.jshint.js");

;eval("define(\"todos/tests/controllers/user.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - controllers\');\n    test(\'controllers/user.js should pass jshint\', function() { \n      ok(false, \'controllers/user.js should pass jshint.\\ncontrollers/user.js: line 1, col 16, \\\'Ember\\\' is not defined.\\n\\n1 error\'); \n    });\n  });//# sourceURL=todos/tests/controllers/user.jshint.js");

;eval("define(\"todos/tests/helpers/resolver\", \n  [\"ember/resolver\",\"exports\"],\n  function(__dependency1__, __exports__) {\n    \"use strict\";\n    var Resolver = __dependency1__[\"default\"];\n\n    var resolver = Resolver.create();\n\n    resolver.namespace = {\n      modulePrefix: \'todos\'\n    };\n\n    __exports__[\"default\"] = resolver;\n  });//# sourceURL=todos/tests/helpers/resolver.js");

;eval("define(\"todos/tests/helpers/start-app\", \n  [\"ember\",\"todos/app\",\"todos/router\",\"exports\"],\n  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n    var Application = __dependency2__[\"default\"];\n    var Router = __dependency3__[\"default\"];\n\n    __exports__[\"default\"] = function startApp(attrs) {\n      var App;\n\n      var attributes = Ember.merge({\n        // useful Test defaults\n        rootElement: \'#ember-testing\',\n        LOG_ACTIVE_GENERATION: false,\n        LOG_VIEW_LOOKUPS: false\n      }, attrs); // but you can override;\n\n      Router.reopen({\n        location: \'none\'\n      });\n\n      Ember.run(function() {\n        App = Application.create(attributes);\n        App.setupForTesting();\n        App.injectTestHelpers();\n      });\n\n      App.reset(); // this shouldn\'t be needed, i want to be able to \"start an app at a specific URL\"\n\n      return App;\n    }\n  });//# sourceURL=todos/tests/helpers/start-app.js");

;eval("define(\"todos/tests/initializers/coalesce-setup.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - initializers\');\n    test(\'initializers/coalesce-setup.js should pass jshint\', function() { \n      ok(false, \'initializers/coalesce-setup.js should pass jshint.\\ninitializers/coalesce-setup.js: line 4, col 18, \\\'Ember\\\' is not defined.\\ninitializers/coalesce-setup.js: line 5, col 18, \\\'Ember\\\' is not defined.\\ninitializers/coalesce-setup.js: line 6, col 17, \\\'Ember\\\' is not defined.\\ninitializers/coalesce-setup.js: line 8, col 18, \\\'CoalesceModelSerializer\\\' is not defined.\\ninitializers/coalesce-setup.js: line 15, col 16, \\\'Ember\\\' is not defined.\\ninitializers/coalesce-setup.js: line 34, col 15, \\\'CoalesceActiveModelAdapter\\\' is not defined.\\ninitializers/coalesce-setup.js: line 1, col 8, \\\'User\\\' is defined but never used.\\ninitializers/coalesce-setup.js: line 2, col 8, \\\'Todo\\\' is defined but never used.\\ninitializers/coalesce-setup.js: line 4, col 5, \\\'decamelize\\\' is defined but never used.\\ninitializers/coalesce-setup.js: line 5, col 5, \\\'underscore\\\' is defined but never used.\\ninitializers/coalesce-setup.js: line 6, col 5, \\\'pluralize\\\' is defined but never used.\\n\\n11 errors\'); \n    });\n  });//# sourceURL=todos/tests/initializers/coalesce-setup.jshint.js");

;eval("define(\"todos/tests/models/todo.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - models\');\n    test(\'models/todo.js should pass jshint\', function() { \n      ok(false, \'models/todo.js should pass jshint.\\nmodels/todo.js: line 1, col 16, \\\'Coalesce\\\' is not defined.\\nmodels/todo.js: line 3, col 12, \\\'Coalesce\\\' is not defined.\\nmodels/todo.js: line 4, col 18, \\\'Coalesce\\\' is not defined.\\nmodels/todo.js: line 5, col 11, \\\'Coalesce\\\' is not defined.\\n\\n4 errors\'); \n    });\n  });//# sourceURL=todos/tests/models/todo.jshint.js");

;eval("define(\"todos/tests/models/user.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - models\');\n    test(\'models/user.js should pass jshint\', function() { \n      ok(false, \'models/user.js should pass jshint.\\nmodels/user.js: line 1, col 16, \\\'Coalesce\\\' is not defined.\\nmodels/user.js: line 3, col 11, \\\'Coalesce\\\' is not defined.\\nmodels/user.js: line 4, col 12, \\\'Coalesce\\\' is not defined.\\n\\n3 errors\'); \n    });\n  });//# sourceURL=todos/tests/models/user.jshint.js");

;eval("define(\"todos/tests/router.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - .\');\n    test(\'router.js should pass jshint\', function() { \n      ok(true, \'router.js should pass jshint.\'); \n    });\n  });//# sourceURL=todos/tests/router.jshint.js");

;eval("define(\"todos/tests/routes/application.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - routes\');\n    test(\'routes/application.js should pass jshint\', function() { \n      ok(true, \'routes/application.js should pass jshint.\'); \n    });\n  });//# sourceURL=todos/tests/routes/application.jshint.js");

;eval("define(\"todos/tests/routes/todos/index.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - routes/todos\');\n    test(\'routes/todos/index.js should pass jshint\', function() { \n      ok(false, \'routes/todos/index.js should pass jshint.\\nroutes/todos/index.js: line 22, col 17, Forgotten \\\'debugger\\\' statement?\\nroutes/todos/index.js: line 22, col 25, Missing semicolon.\\nroutes/todos/index.js: line 3, col 16, \\\'Ember\\\' is not defined.\\nroutes/todos/index.js: line 1, col 8, \\\'Todo\\\' is defined but never used.\\nroutes/todos/index.js: line 6, col 21, \\\'params\\\' is defined but never used.\\n\\n5 errors\'); \n    });\n  });//# sourceURL=todos/tests/routes/todos/index.jshint.js");

;eval("define(\"todos/tests/routes/user.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - routes\');\n    test(\'routes/user.js should pass jshint\', function() { \n      ok(false, \'routes/user.js should pass jshint.\\nroutes/user.js: line 1, col 16, \\\'Ember\\\' is not defined.\\n\\n1 error\'); \n    });\n  });//# sourceURL=todos/tests/routes/user.jshint.js");

;eval("define(\"todos/tests/test-helper\", \n  [\"todos/tests/helpers/resolver\",\"ember-qunit\"],\n  function(__dependency1__, __dependency2__) {\n    \"use strict\";\n    var resolver = __dependency1__[\"default\"];\n    var setResolver = __dependency2__.setResolver;\n\n    setResolver(resolver);\n\n    document.write(\'<div id=\"ember-testing-container\"><div id=\"ember-testing\"></div></div>\');\n\n    QUnit.config.urlConfig.push({ id: \'nocontainer\', label: \'Hide container\'});\n    if (QUnit.urlParams.nocontainer) {\n      document.getElementById(\'ember-testing-container\').style.visibility = \'hidden\';\n    } else {\n      document.getElementById(\'ember-testing-container\').style.visibility = \'visible\';\n    }\n  });//# sourceURL=todos/tests/test-helper.js");

;eval("define(\"todos/tests/todos/tests/helpers/resolver.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - todos/tests/helpers\');\n    test(\'todos/tests/helpers/resolver.js should pass jshint\', function() { \n      ok(true, \'todos/tests/helpers/resolver.js should pass jshint.\'); \n    });\n  });//# sourceURL=todos/tests/todos/tests/helpers/resolver.jshint.js");

;eval("define(\"todos/tests/todos/tests/helpers/start-app.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - todos/tests/helpers\');\n    test(\'todos/tests/helpers/start-app.js should pass jshint\', function() { \n      ok(true, \'todos/tests/helpers/start-app.js should pass jshint.\'); \n    });\n  });//# sourceURL=todos/tests/todos/tests/helpers/start-app.jshint.js");

;eval("define(\"todos/tests/todos/tests/test-helper.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - todos/tests\');\n    test(\'todos/tests/test-helper.js should pass jshint\', function() { \n      ok(true, \'todos/tests/test-helper.js should pass jshint.\'); \n    });\n  });//# sourceURL=todos/tests/todos/tests/test-helper.jshint.js");
