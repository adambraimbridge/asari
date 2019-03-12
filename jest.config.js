module.exports = {
	testEnvironment: "node",
	collectCoverage: true,
	collectCoverageFrom: ["**/packages/**/src/**"],
	coverageDirectory: "test-results/coverage/",
	reporters: [
		"default",
		[
			"jest-junit",
			{
				outputDirectory: "test-results/jest/",
				outputName: "results.xml"
			}
		]
	]
};
