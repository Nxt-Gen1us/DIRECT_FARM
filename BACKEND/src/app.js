import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger.js';
import v1Routes from './routes/v1/index.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(helmet());
app.use(cors({
	origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
	credentials: true
}));
// Capture raw body for webhook signature verification when needed
app.use(express.json({
	verify: (req, _res, buf) => {
		// Capture raw body for all JSON requests so webhook signature verification
		// can rely on the exact bytes sent by the gateway.
		req.rawBody = buf;
	}
}));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(morgan('combined'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', v1Routes);

app.use(errorHandler);

export default app;
